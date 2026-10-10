def calculate_risk(transaction):
    score = 0
    reasons = []

    # Rule 1: High transaction amount
    if transaction["amount"] >= 100000:
        score += 25
        reasons.append("High transaction amount")

    # Rule 2: International transaction
    if transaction["is_international"]:
        score += 20
        reasons.append("International transaction")

    # Keep score within 0-100
    score = min(score, 100)

    # Determine risk level
    if score >= 80:
        risk_level = "Critical"
    elif score >= 60:
        risk_level = "High"
    elif score >= 30:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "reasons": reasons
    }