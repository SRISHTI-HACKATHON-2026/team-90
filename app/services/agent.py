import random
from datetime import datetime, timedelta

def analyze_locality(locality):
    total = len(locality["houses"])
    active = sum(
        1 for h in locality["houses"]
        if h.get("last_report") and
        datetime.utcnow() - h["last_report"] < timedelta(hours=24)
    )

    participation = active / total if total else 0

    return {
        "participation": participation,
        "active": active,
        "total": total
    }


def decide_action(analysis):
    p = analysis["participation"]

    if p < 0.1:
        return "EMERGENCY_CALL_BLAST"
    elif p < 0.25:
        return "TARGETED_IVR"
    elif p < 0.5:
        return "SEND_REMINDER"
    else:
        return "NO_ACTION"


def select_targets(locality, count=5):
    inactive = [
        h for h in locality["houses"]
        if not h.get("last_report")
    ]
    return random.sample(inactive, min(count, len(inactive)))