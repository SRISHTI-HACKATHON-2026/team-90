def get_resource_status(value):
    """Per-resource status based on usage thresholds."""
    if value < 20:
        return "good"
    elif value < 50:
        return "moderate"
    else:
        return "critical"


def calculate_ciu(water, waste, energy):
    """CIU = Community Impact Unit. Higher = better community health.
    Calculated as 100 minus total resource usage, clamped to 0-100."""
    ciu = 100 - (water + waste + energy)
    ciu = max(0, min(100, ciu))

    # Global status derived from per-resource assessments
    water_status = get_resource_status(water)
    waste_status = get_resource_status(waste)
    energy_status = get_resource_status(energy)

    statuses = [water_status, waste_status, energy_status]

    if "critical" in statuses:
        status = "red"
    elif "moderate" in statuses:
        status = "yellow"
    else:
        status = "green"

    # Weather reflects overall system health
    if status == "green":
        weather = "sunny"
    elif status == "yellow":
        weather = "cloudy"
    else:
        weather = "storm"

    return ciu, status, weather, water_status, waste_status, energy_status