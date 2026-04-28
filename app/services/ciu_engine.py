def calculate_ciu(water, waste, energy):
    # Weighted scoring
    ciu = (water * 3) + (waste * 2) + (energy * 1)

    if ciu >= 80:
        status = "green"
    elif ciu >= 50:
        status = "yellow"
    else:
        status = "red"

    return ciu, status