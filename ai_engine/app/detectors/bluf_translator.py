import re
from typing import Dict, Any, List

class BLUFRiskTranslator:
    """
    Translates raw technical cyber threat intelligence into Executive Decision-Ready
    Risk Reports using the Minto Pyramid / Strategy S4 Architecture (Aguilar 2026).
    """

    def __init__(self):
        self.version = "1.0.0"

    def translate_threat(self, threat_input: Dict[str, Any]) -> Dict[str, Any]:
        title = threat_input.get("title", "Detected Security Incident")
        threat_type = threat_input.get("threat_type", "General Suspicious Activity").lower()
        severity = threat_input.get("severity", "HIGH").upper()
        raw_details = threat_input.get("raw_details", "")
        source_ip = threat_input.get("source_ip", "Unknown")
        target_asset = threat_input.get("target_asset", "Internal Network / Workstation")
        cve_id = threat_input.get("cve_id", "")

        # Categorize threat pattern
        if "ransomware" in threat_type or "ransom" in raw_details.lower() or "encrypt" in raw_details.lower():
            category = "RANSOMWARE"
            bluf = f"CRITICAL DECISION: Immediately authorize isolation of {target_asset} to stop automated ransomware encryption before core accounting and client databases are compromised."
            business_impact = {
                "financial_exposure": "₹15,00,000 – ₹45,00,000 (Ransom extortion, forensic recovery, business downtime)",
                "operational_downtime": "48 to 96 hours of complete operational freeze if database encrypts",
                "regulatory_risk": "Mandatory CERT-In reporting within 6 hours; legal scrutiny under DPDP Act 2023 for client data breach",
                "reputational_impact": "Severe loss of client trust and supply-chain partner cancellations"
            }
            affected_scope = f"Business-critical file servers and workstations connected to {target_asset}. Backups at immediate risk if unsegmented."
            actions = [
                {"role": "IT Administrator", "directive": f"Disconnect {target_asset} from local Wi-Fi/LAN and verify offline immutable backup integrity", "rationale": "Prevents ransomware lateral spread to domain controllers and network shares"},
                {"role": "Business Owner / MD", "directive": "Enforce company-wide password reset for all cloud accounting & email accounts", "rationale": "Invalidates any compromised credentials harvested prior to encryption"},
                {"role": "Finance Team", "directive": "Halt outgoing bank transfers until all accounting endpoints are certified clean", "rationale": "Guards against simultaneous invoice fraud and unauthorized fund diversion"}
            ]

        elif "phishing" in threat_type or "quishing" in threat_type or "credential" in raw_details.lower() or "aitm" in raw_details.lower():
            category = "CREDENTIAL_PHISHING"
            bluf = f"URGENT ACTION: Terminate active employee session tokens and reset M365/Google Workspace passwords following credential harvesting attempt targeting {target_asset}."
            business_impact = {
                "financial_exposure": "₹3,00,000 – ₹12,00,000 (Unauthorized wire transfers, fraudulent vendor invoice diversion)",
                "operational_downtime": "4 to 12 hours required for mailbox audit and account recovery",
                "regulatory_risk": "Compliance notification required if employee email mailbox holds customer PII",
                "reputational_impact": "Moderate: Threat actors could email clients directly from legitimate company address"
            }
            affected_scope = f"Corporate email mailbox, OneDrive/Google Drive shared folders, and corporate identity credentials of affected user."
            actions = [
                {"role": "IT Security Lead", "directive": "Revoke all active OAuth session tokens and enforce hardware/FIDO2 MFA for affected user", "rationale": "Neutralizes Adversary-in-the-Middle (AiTM) session token hijacking"},
                {"role": "Accounting / HR Lead", "directive": "Review recent email inbox forwarding rules and outbound payment requests from past 48h", "rationale": "Detects unauthorized automated email redirect rules set by intruder"},
                {"role": "All Employees", "directive": "Issue urgent warning regarding ongoing brand-impersonation emails and fake QR invoices", "rationale": "Prevents secondary staff members from falling for identical phishing lures"}
            ]

        elif "exfiltration" in threat_type or "c2" in threat_type or "backdoor" in raw_details.lower() or "trojan" in raw_details.lower():
            category = "DATA_EXFILTRATION_C2"
            bluf = f"CRITICAL ACTION: Block external IP ({source_ip}) at the perimeter firewall and quarantine host {target_asset} following detection of unauthorized data transmission."
            business_impact = {
                "financial_exposure": "₹8,00,000 – ₹25,00,000 (Theft of proprietary designs, customer records, and recovery fees)",
                "operational_downtime": "12 to 24 hours while infected device is re-imaged and forensic snapshot taken",
                "regulatory_risk": "Potential heavy DPDP Act compliance penalty for failing to safeguard personal customer records",
                "reputational_impact": "High: Risk of proprietary data or trade secrets being leaked on dark web"
            }
            affected_scope = f"Endpoint {target_asset} and all customer/financial records accessible with local administrative privileges."
            actions = [
                {"role": "Network Administrator", "directive": f"Blacklist outbound connections to IP {source_ip} on perimeter router/firewall", "rationale": "Severes communication line between malware and attacker's command server"},
                {"role": "System Administrator", "directive": f"Capture volatile RAM dump on {target_asset} then immediately isolate from network", "rationale": "Preserves forensic evidence while stopping ongoing data theft"},
                {"role": "Executive Management", "directive": "Audit scope of exfiltrated files to determine exact regulatory disclosure obligations", "rationale": "Ensures full legal compliance with CERT-In and industry data guidelines"}
            ]

        else:
            category = "SECURITY_POSTURE_VULNERABILITY"
            bluf = f"DECISION REQUIRED: Authorize emergency patch deployment for {target_asset} {cve_id} to close known remote access vulnerability."
            business_impact = {
                "financial_exposure": "₹2,00,000 – ₹6,00,000 in preventive costs vs ₹20,00,000+ if actively exploited",
                "operational_downtime": "Under 30 minutes scheduled maintenance window during non-peak hours",
                "regulatory_risk": "Low if remediated promptly within vulnerability disclosure SLAs",
                "reputational_impact": "Minimal if patched before breach occurs"
            }
            affected_scope = f"Public-facing firewall, VPN gateways, or unpatched software running on {target_asset}."
            actions = [
                {"role": "IT Operations", "directive": f"Apply latest security patch/firmware update to {target_asset} immediately", "rationale": "Closes known attack vector before automated scanners identify opening"},
                {"role": "System Administrator", "directive": "Review firewall access control lists (ACLs) and restrict administrative ports to trusted IPs", "rationale": "Limits attack surface and stops unauthorized internet probing"}
            ]

        return {
            "threat_id": threat_input.get("id", "INC-" + str(hash(title))[-6:]),
            "threat_title": title,
            "category": category,
            "severity": severity,
            "bluf": bluf,
            "business_impact": business_impact,
            "affected_scope": affected_scope,
            "prioritized_actions": actions,
            "technical_context": {
                "source_ip": source_ip,
                "target_asset": target_asset,
                "cve_id": cve_id,
                "raw_details": raw_details
            },
            "compliance_summary": "NIST CSF 2.0 (Detect / Respond) • CERT-In Cybersecurity Guidelines 2023 Compliant"
        }
