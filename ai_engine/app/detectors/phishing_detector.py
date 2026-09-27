import math
import re
from urllib.parse import urlparse
from typing import Dict, Any, List

SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "account", "banking", "secure", "update", "wallet",
    "password", "auth", "confirm", "invoice", "payment", "free", "gift", "kyc",
    "otp", "aadhaar", "pan-card", "support", "service", "billing", "recovery"
]

HIGH_RISK_TLDS = {
    ".xyz", ".top", ".club", ".work", ".click", ".gq", ".ml", ".cf", ".ga",
    ".buzz", ".loan", ".racing", ".live", ".guru", ".fit", ".rest", ".online"
}

TRUSTED_DOMAINS = {
    "google.com", "microsoft.com", "apple.com", "amazon.com", "github.com",
    "gov.in", "nic.in", "sbi.co.in", "hdfcbank.com", "icicibank.com"
}

def calculate_entropy(text: str) -> float:
    if not text:
        return 0.0
    prob = [float(text.count(c)) / len(text) for c in set(text)]
    return -sum(p * math.log2(p) for p in prob if p > 0)

class PhishingDetector:
    def __init__(self):
        self.version = "1.0.0"

    def extract_features(self, url: str) -> Dict[str, Any]:
        parsed = urlparse(url if "://" in url else f"http://{url}")
        hostname = parsed.hostname or ""
        path = parsed.path or ""
        query = parsed.query or ""

        # Check IP address as host
        is_ip = bool(re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", hostname))
        
        # Keyword count
        kw_matches = [kw for kw in SUSPICIOUS_KEYWORDS if kw in url.lower()]
        
        # Subdomain count
        subdomains = hostname.split(".")
        subdomain_count = max(0, len(subdomains) - 2)

        # High risk TLD
        tld = "." + subdomains[-1] if len(subdomains) > 1 else ""
        has_risky_tld = tld in HIGH_RISK_TLDS

        # Structural signals
        has_at_symbol = "@" in url
        has_double_slash_redirect = "//" in path
        hyphen_count_host = hostname.count("-")
        entropy = calculate_entropy(hostname)
        url_length = len(url)

        return {
            "hostname": hostname,
            "url_length": url_length,
            "is_ip_address": is_ip,
            "keyword_matches": kw_matches,
            "subdomain_count": subdomain_count,
            "tld": tld,
            "has_risky_tld": has_risky_tld,
            "has_at_symbol": has_at_symbol,
            "has_double_slash_redirect": has_double_slash_redirect,
            "hyphen_count": hyphen_count_host,
            "entropy": round(entropy, 3)
        }

    def analyze(self, url: str) -> Dict[str, Any]:
        if not url or not url.strip():
            return {
                "error": "URL cannot be empty",
                "risk_score": 0,
                "verdict": "SAFE"
            }

        url = url.strip()
        features = self.extract_features(url)
        hostname = features["hostname"]

        # Check trusted whitelist
        for trusted in TRUSTED_DOMAINS:
            if hostname == trusted or hostname.endswith("." + trusted):
                return {
                    "url": url,
                    "verdict": "SAFE",
                    "risk_score": 5,
                    "confidence": 0.98,
                    "classification": "Verified Legitimate Domain",
                    "risk_level": "LOW",
                    "features": features,
                    "reasons": ["Domain matches verified trusted enterprise directory"],
                    "recommendation": "Safe to access under normal company security policy."
                }

        risk_score = 0
        reasons = []

        if features["is_ip_address"]:
            risk_score += 35
            reasons.append("Raw IP address used instead of reputable domain name")

        if features["has_at_symbol"]:
            risk_score += 25
            reasons.append("Contains '@' symbol designed to mask true destination")

        if features["has_double_slash_redirect"]:
            risk_score += 20
            reasons.append("Path contains redirection attempt ('//')")

        if features["has_risky_tld"]:
            risk_score += 25
            reasons.append(f"Uses high-risk TLD '{features['tld']}' frequently associated with throwaway phishing campaigns")

        if features["subdomain_count"] >= 3:
            risk_score += 20
            reasons.append(f"Excessive subdomain nesting ({features['subdomain_count']} levels)")

        if features["hyphen_count"] >= 2:
            risk_score += 15
            reasons.append(f"Multiple hyphens in hostname ({features['hyphen_count']}) indicating potential typosquatting")

        if len(features["keyword_matches"]) > 0:
            kw_points = min(30, len(features["keyword_matches"]) * 12)
            risk_score += kw_points
            reasons.append(f"Targeted security/financial keywords detected: {', '.join(features['keyword_matches'])}")

        if features["entropy"] > 4.2:
            risk_score += 15
            reasons.append(f"High hostname lexical randomness/entropy ({features['entropy']})")

        if features["url_length"] > 90:
            risk_score += 10
            reasons.append(f"Abnormally long URL string ({features['url_length']} characters)")

        # Cap score 0 - 100
        risk_score = min(100, max(0, risk_score))

        if risk_score >= 65:
            verdict = "MALICIOUS"
            risk_level = "CRITICAL" if risk_score >= 85 else "HIGH"
            recommendation = "BLOCK IMMEDIATELY. Threat indicates credential harvesting or malware delivery."
        elif risk_score >= 35:
            verdict = "SUSPICIOUS"
            risk_level = "MEDIUM"
            recommendation = "Caution required. Do not submit credentials or download attachments."
        else:
            verdict = "SAFE"
            risk_level = "LOW"
            recommendation = "No prominent phishing heuristics found. Standard browsing precautions apply."

        return {
            "url": url,
            "verdict": verdict,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "confidence": round(0.75 + (risk_score / 400), 2),
            "classification": "Phishing / Malicious Site" if verdict == "MALICIOUS" else ("Suspicious Link" if verdict == "SUSPICIOUS" else "Benign URL"),
            "features": features,
            "reasons": reasons if reasons else ["URL conforms to standard web naming patterns"],
            "recommendation": recommendation
        }
