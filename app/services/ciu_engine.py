def get_resource_status(value):
    """Per-resource status based on usage thresholds."""
    if value < 20:
        return "good"
    elif value < 50:
        return "moderate"
    else:
        return "critical"


def calculate_ciu(water, waste, energy):
    """Compute CIU from normalized resource usage values."""
    total = water + waste + energy

    if total == 0:
        return 0, "LOW", "Clear", 0, 0, 0

    # Normalize inputs to avoid CIU collapse when raw values are large.
    water_score = min(water / 100, 1)
    waste_score = min(waste / 100, 1)
    energy_score = min(energy / 100, 1)

    # Average normalized scores, then convert to percentage.
    ciu = (water_score + waste_score + energy_score) / 3
    ciu = round(ciu * 100, 2)

    status = "LOW"
    if ciu > 70:
        status = "HIGH"
    elif ciu > 40:
        status = "MEDIUM"

    return ciu, status, "Stable", water_score, waste_score, energy_score