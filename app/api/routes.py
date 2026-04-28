from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import get_db
from app.models.models import Log
from app.services.ciu_engine import calculate_ciu

router = APIRouter()


# ✅ HEALTH CHECK
@router.get("/health")
def health_check():
    return {"status": "ok"}


# 📥 LOG ACTION (IVR / API INPUT)
@router.post("/log-action")
def log_action(phone: str, resource: str, value: int, db: Session = Depends(get_db)):
    log = Log(
        phone=phone,
        resource=resource,
        value=value,
        timestamp=datetime.utcnow()
    )

    db.add(log)
    db.commit()

    return {"message": "Action logged successfully"}


# 📊 COMMUNITY STATUS (SMART INSIGHTS)
@router.get("/get-status")
def get_status(db: Session = Depends(get_db)):
    logs = db.query(Log).all()

    # Aggregate totals
    water = sum(l.value for l in logs if l.resource == "water")
    waste = sum(l.value for l in logs if l.resource == "waste")
    energy = sum(l.value for l in logs if l.resource == "energy")

    # CIU + status
    ciu, status = calculate_ciu(water, waste, energy)

    # 🔥 Identify worst resource
    resource_map = {
        "water": water,
        "waste": waste,
        "energy": energy
    }
    worst_resource = max(resource_map, key=resource_map.get) if logs else None

    # 📈 Simple trend logic
    total = water + waste + energy
    trend = "up" if total > 50 else "down"

    # 🔔 Community message
    message = f"{worst_resource.upper()} usage is critical today" if worst_resource else "No data yet"

    return {
        "water": water,
        "waste": waste,
        "energy": energy,
        "ciu_score": ciu,
        "status": status,
        "worst": worst_resource,
        "trend": trend,
        "message": message
    }


# 🔁 LIVE LOG FEED
@router.get("/logs")
def get_logs(db: Session = Depends(get_db)):
    logs = db.query(Log).order_by(Log.timestamp.desc()).limit(20).all()

    return [
        {
            "phone": l.phone,
            "resource": l.resource,
            "value": l.value,
            "time": str(l.timestamp)
        }
        for l in logs
    ]


# 📊 RESOURCE ANALYTICS
@router.get("/analytics")
def analytics(db: Session = Depends(get_db)):
    logs = db.query(Log).all()

    water = sum(l.value for l in logs if l.resource == "water")
    waste = sum(l.value for l in logs if l.resource == "waste")
    energy = sum(l.value for l in logs if l.resource == "energy")

    return {
        "water": water,
        "waste": waste,
        "energy": energy
    }


# 🗺️ ZONE ACTIVITY (SIMULATED)
@router.get("/zones")
def zones(db: Session = Depends(get_db)):
    logs = db.query(Log).all()

    zone_counts = {}

    for log in logs:
        zone = log.phone[-2:]  # simple grouping
        zone_counts[zone] = zone_counts.get(zone, 0) + 1

    return zone_counts