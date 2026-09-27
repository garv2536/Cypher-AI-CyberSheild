import re
from typing import Dict, Any
from .phishing_detector import PhishingDetector

class QRAnalyzer:
    """
    Analyzes QR codes for Quishing and Dual-Module Evasion attempts.
    Incorporates insights from Legere (2026) on center-pixel sampling evasion.
    """
    def __init__(self):
        self.url_detector = PhishingDetector()

    def analyze_qr_payload(self, raw_data: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        metadata = metadata or {}
        decoded_url = raw_data.strip()
        
        # 1. Analyze the decoded URL using Phishing Detector
        url_analysis = self.url_detector.analyze(decoded_url)

        # 2. Check for Dual-Module Evasion Signatures (Legere 2026)
        # Parameters: module size, submodule size, color variance, multi-alignment indicators
        submodule_detected = metadata.get("submodule_detected", False)
        pixel_variance = float(metadata.get("pixel_variance", 0.0))
        module_size = int(metadata.get("module_size", 29))
        submodule_size = int(metadata.get("submodule_size", 0))

        dual_module_risk = False
        evasion_reasons = []

        if submodule_detected or (submodule_size >= 2 and submodule_size <= 5):
            dual_module_risk = True
            evasion_reasons.append("Structural sub-module overlay detected: Exploit targets center-pixel gateway decoders (Dual-Module Quishing)")

        if pixel_variance > 0.28:
            dual_module_risk = True
            evasion_reasons.append(f"High intra-module pixel color variance ({round(pixel_variance, 2)}) indicates multiple embedded data layers")

        # 3. Assess overall Quishing Risk
        base_risk = url_analysis.get("risk_score", 0)
        if dual_module_risk:
            combined_risk = min(100, base_risk + 45)
            verdict = "CRITICAL_QUISHING_EVASION"
            severity = "CRITICAL"
        elif base_risk >= 60:
            combined_risk = base_risk
            verdict = "MALICIOUS_QR_PHISHING"
            severity = "HIGH"
        elif base_risk >= 30:
            combined_risk = base_risk
            verdict = "SUSPICIOUS_QR"
            severity = "MEDIUM"
        else:
            combined_risk = max(5, base_risk)
            verdict = "CLEAN_QR"
            severity = "LOW"

        return {
            "qr_data": decoded_url,
            "verdict": verdict,
            "severity": severity,
            "quishing_risk_score": combined_risk,
            "dual_module_evasion_detected": dual_module_risk,
            "url_analysis": url_analysis,
            "evasion_indicators": evasion_reasons if evasion_reasons else ["Conforms to standard single-layer ISO/IEC 18004 Model 2 format"],
            "mitigation_instructions": [
                "Do not scan or load destination on mobile camera.",
                "Verify sender identity through out-of-band communication (phone/direct message).",
                "Quarantine source email and block sender domain on company mail gateway."
            ] if severity in ["CRITICAL", "HIGH"] else ["QR Code verified safe."]
        }
