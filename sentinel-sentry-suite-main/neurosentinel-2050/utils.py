import re
from urllib.parse import urlparse

def phishing_check(url: str = "", text: str = "") -> dict:
    """Simple rule-based phishing check.

    Returns a dict {threat: bool, reason: str, score: float, details: dict}
    """
    details = {}
    score = 0.0
    if url:
        parsed = urlparse(url)
        hostname = parsed.hostname or ""
        details['hostname'] = hostname
        # Suspicious TLDs and punycode
        if hostname.startswith('xn--'):
            score += 0.5
            details['punycode'] = True
        # Many phishing sites use long subdomains
        if hostname.count('.') >= 3:
            score += 0.2
            details['long_subdomain'] = True
        # IP address in URL
        if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", hostname):
            score += 0.6
            details['ip_in_url'] = True
    if text:
        # common phishing phrases
        triggers = ["verify your account", "update your payment", "click the link below", "confirm your identity"]
        lowered = text.lower()
        matches = [t for t in triggers if t in lowered]
        if matches:
            score += 0.4
            details['matches'] = matches

    threat = score >= 0.7
    reason = "High score" if threat else ("Suspicious" if score >= 0.4 else "Clean")
    return {"threat": threat, "reason": reason, "score": round(score, 2), "details": details}

# Placeholder for many other functions — keep signatures so pages can import
def malware_scan(sample: bytes = b"") -> dict:
    return {"malicious": False, "engines": {}}

def intrusion_detection(logs: str = "") -> dict:
    return {"alerts": [], "summary": "No intrusion patterns found"}

def ddos_analysis(flow_stats: dict = None) -> dict:
    return {"ddos": False, "reason": "No anomaly"}

def wallet_trace(address: str) -> dict:
    return {"address": address, "tx_count": 0, "balance": "0 ETH", "suspicious": False}
