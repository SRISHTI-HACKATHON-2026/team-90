from typing import Optional
import os
import re
from fastapi import APIRouter, Depends, Request
from fastapi.responses import PlainTextResponse, Response
from sqlalchemy.orm import Session
from datetime import datetime
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

from app.db.database import get_db
from app.models.models import Log
from app.services.ciu_engine import calculate_ciu
from app.utils.twilio_sms import send_sms

router = APIRouter()

# ENV
ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
DEMO_CALL_TO = os.getenv("TWILIO_DEMO_CALL_TO")
IVR_URL = os.getenv("TWILIO_IVR_URL")

client = Client(ACCOUNT_SID, AUTH_TOKEN)

# BASE URL (IMPORTANT)
BASE_URL = IVR_URL.replace("/ivr", "")

# ALERTS
ALERT_NUMBERS = ["+91XXXXXXXXXX"]
last_alert = {}


def should_send(resource):
    import time
    now = time.time()
    if resource not in last_alert or now - last_alert[resource] > 60:
        last_alert[resource] = now
        return True
    return False


# ==============================
# HEALTH
# ==============================
@router.get("/health")
def health_check():
    return {"status": "ok"}


# ==============================
# CALL TRIGGER
# ==============================
@router.get("/make-call")
def make_call():
    try:
        print("CALL triggered")
        if not DEMO_CALL_TO or not TWILIO_NUMBER or not IVR_URL:
            return {"error": "Missing Twilio environment variables"}
        call = client.calls.create(
            to=DEMO_CALL_TO,
            from_=TWILIO_NUMBER,
            url=IVR_URL,
        )
        return {"status": "calling", "sid": call.sid}
    except Exception as e:
        return {"error": str(e)}


# ==============================
# SMS DEMO TRIGGER
# ==============================
@router.get("/send-sms")
def send_demo_sms():
    try:
        print("SMS triggered")
        if not DEMO_CALL_TO or not TWILIO_NUMBER:
            return {"error": "Missing Twilio environment variables"}
        message = client.messages.create(
            body="water 120",
            from_=TWILIO_NUMBER,
            to=DEMO_CALL_TO,
        )
        return {"status": "sent", "sid": message.sid}
    except Exception as e:
        return {"error": str(e)}


# ==============================
# IVR START (RESOURCE SELECT)
# ==============================
@router.post("/ivr")
async def ivr():
    response = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather numDigits="1" action="{BASE_URL}/ivr-select" method="POST">
        <Say>Welcome to Eco Ledger.</Say>
        <Say>Press 1 for water. Press 2 for waste. Press 3 for energy.</Say>
    </Gather>
</Response>"""
    return Response(content=response, media_type="application/xml")


# ==============================
# RESOURCE SELECT
# ==============================
@router.post("/ivr-select")
async def ivr_select(request: Request):
    form = await request.form()
    digit = form.get("Digits", "1")

    mapping = {"1": "water", "2": "waste", "3": "energy"}
    resource = mapping.get(digit, "water")
    action_url = f"{BASE_URL}/ivr-amount?resource={resource}"
    say = f"<Say>Enter {resource} amount followed by the hash key.</Say>"

    response = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    {say}
    <Gather finishOnKey="#" action="{action_url}" method="POST"/>
</Response>"""

    return Response(content=response, media_type="application/xml")


# ==============================
# AMOUNT LOG
# ==============================
@router.post("/ivr-amount")
async def ivr_amount(request: Request, db: Session = Depends(get_db)):
    form = await request.form()

    digits = form.get("Digits", "0")
    value = int(digits) if digits.isdigit() else 0

    resource = request.query_params.get("resource", "water")

    log = Log(
        phone="ivr_user",
        sender="captain",
        type="verified",
        resource=resource,
        value=value,
        timestamp=datetime.utcnow(),
    )

    db.add(log)
    db.commit()

    say = f"<Say>{resource} of {value} logged successfully.</Say>"

    response = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    {say}
</Response>"""

    return Response(content=response, media_type="application/xml")


# ==============================
# SMS / WHATSAPP
# ==============================
@router.post("/twilio-webhook")
async def twilio_webhook(request: Request, db: Session = Depends(get_db)):
    form = await request.form()

    message = form.get("Body", "").strip().lower()
    sender = form.get("From", "unknown")

    print(f"[SMS RECEIVED] sender={sender!r} message={message!r}")

    # Flexible regex parsing: matches "water 120", "water:120", "water - 120", etc.
    match = re.match(r"(water|waste|energy)\s*[:\-]?\s*(\d+)", message)

    if match:
        resource = match.group(1)
        value = int(match.group(2))
        verified = True
        print(f"[SMS VERIFIED] resource={resource!r} value={value!r}")
    else:
        verified = False
        print(f"[SMS OBSERVATION] message={message!r}")

    if verified:
        log = Log(
            phone=sender,
            sender="captain",
            type="verified",
            resource=resource,
            value=value,
            timestamp=datetime.utcnow(),
        )
    else:
        log = Log(
            phone=sender,
            sender="resident",
            type="observation",
            message=message,
            timestamp=datetime.utcnow(),
        )

    db.add(log)
    db.commit()
    print(f"[SMS LOGGED] type={log.type!r} id={log.id}")

    return PlainTextResponse("Received")


# ==============================
# STATUS
# ==============================
@router.get("/get-status")
def get_status(db: Session = Depends(get_db)):
    logs = db.query(Log).filter(Log.type == "verified").all()

    water = sum(l.value for l in logs if l.resource == "water")
    waste = sum(l.value for l in logs if l.resource == "waste")
    energy = sum(l.value for l in logs if l.resource == "energy")

    ciu, status, weather, ws, wss, es = calculate_ciu(water, waste, energy)

    return {
        "water": water,
        "waste": waste,
        "energy": energy,
        "ciu_score": ciu,
        "status": status,
        "weather": weather,
    }
# ==============================
# LOGS (FIX FOR ADMIN AUDIT)
# ==============================
@router.get("/logs")
def get_logs(db: Session = Depends(get_db)):
    logs = db.query(Log).order_by(Log.timestamp.desc()).limit(50).all()

    return [
        {
            "phone": l.phone,
            "sender": l.sender,
            "type": l.type,
            "resource": l.resource,
            "value": l.value,
            "message": l.message,
            "time": str(l.timestamp)
        }
        for l in logs
    ]