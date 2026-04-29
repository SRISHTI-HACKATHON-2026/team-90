from twilio.rest import Client
import os

ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
FROM_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

client = Client(ACCOUNT_SID, AUTH_TOKEN)


def send_sms(to_number, message):
    try:
        client.messages.create(
            body=message,
            from_=FROM_NUMBER,
            to=to_number
        )
        print("SMS sent:", to_number)
    except Exception as e:
        print("SMS error:", str(e))
