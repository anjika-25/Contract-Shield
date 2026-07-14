# Definition of risk taxonomy categories and severity levels for LegalLens AI

RISK_CATEGORIES = {
    "Termination",
    "Auto Renewal",
    "Liability",
    "Arbitration",
    "Payment",
    "Confidentiality",
    "Indemnity",
    "IP Rights",
    "Force Majeure",
    "Jurisdiction",
    "Data Privacy"
}

RISK_LEVELS = {
    "Low",
    "Medium",
    "High"
}

def is_valid_category(category: str) -> bool:
    """Checks if a risk category is valid according to the taxonomy."""
    return category in RISK_CATEGORIES

def is_valid_risk_level(level: str) -> bool:
    """Checks if a risk level is valid according to the taxonomy."""
    return level in RISK_LEVELS
