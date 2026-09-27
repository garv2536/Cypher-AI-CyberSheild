import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from typing import List, Dict, Any

# Known benign domains and services for post-scoring allowlist suppression (Sinanian 2026)
BENIGN_DESTINATION_ALLOWLIST = {
    "update.microsoft.com",
    "windowsupdate.com",
    "play.google.com",
    "apple.com",
    "connectivitycheck.gstatic.com",
    "time.windows.com",
    "pool.ntp.org",
    "dns.google",
    "cloudflare-dns.com",
    "cdn.jsdelivr.net"
}

SUSPICIOUS_PORTS = {
    4444: "Metasploit / Reverse Shell default",
    1337: "Custom Backdoor / Trojan default",
    2053: "MobileSpy / Cloudflare-fronted non-standard port",
    8443: "Common alternative C2 SSL port",
    7096: "uMobix UDP exfiltration range",
    7097: "uMobix UDP exfiltration range",
    6667: "IRC C2 botnet protocol",
    3389: "Direct External RDP access attempt",
    445: "SMB / Lateral movement port"
}

class NetworkAnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(
            n_estimators=100,
            contamination=0.05,
            random_state=42
        )
        self._train_baseline()

    def _train_baseline(self):
        """Pre-trains model on simulated standard benign MSME traffic profile."""
        np.random.seed(42)
        n_samples = 1500
        # Standard web/app traffic: port 80/443, modest packet sizes, normal durations
        durations = np.random.exponential(scale=2.5, size=n_samples)
        src_ports = np.random.randint(49152, 65535, size=n_samples)
        dst_ports = np.random.choice([80, 443, 53, 123], size=n_samples, p=[0.15, 0.70, 0.12, 0.03])
        bytes_sent = np.random.lognormal(mean=7.0, sigma=1.2, size=n_samples)
        bytes_recv = np.random.lognormal(mean=8.5, sigma=1.5, size=n_samples)
        packet_count = np.random.poisson(lam=18, size=n_samples) + 2

        X_train = np.column_stack([durations, src_ports, dst_ports, bytes_sent, bytes_recv, packet_count])
        self.model.fit(X_train)

    def analyze_flow(self, flow: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyzes a single network flow or session.
        Applies Isolation Forest scoring + Post-Scoring Allowlist Suppression.
        """
        duration = float(flow.get("duration", 1.0))
        src_port = int(flow.get("src_port", 50000))
        dst_port = int(flow.get("dst_port", 443))
        bytes_sent = float(flow.get("bytes_sent", 500))
        bytes_recv = float(flow.get("bytes_recv", 1200))
        packet_count = int(flow.get("packet_count", 10))
        dest_host = str(flow.get("dest_host", "")).lower().strip()
        protocol = str(flow.get("protocol", "TCP")).upper()

        # Feature vector for ML
        X = np.array([[duration, src_port, dst_port, bytes_sent, bytes_recv, packet_count]])
        raw_score = float(self.model.decision_function(X)[0])
        is_ml_anomaly = bool(self.model.predict(X)[0] == -1)

        # Post-Scoring Allowlist Suppression check (Dest domain check, avoiding JA3 over-suppression)
        is_allowlisted = any(dest_host == benign or dest_host.endswith("." + benign) for benign in BENIGN_DESTINATION_ALLOWLIST)

        # Port heuristics
        is_suspicious_port = dst_port in SUSPICIOUS_PORTS
        port_alert_reason = SUSPICIOUS_PORTS.get(dst_port, "")

        # High data exfiltration signal (e.g. Sent >> Recv by ratio of 10:1 and > 200KB)
        is_exfiltration = bytes_sent > 200000 and bytes_sent > (bytes_recv * 5)

        # Aggregate Risk Assessment
        if is_allowlisted:
            verdict = "BENIGN_SUPPRESSED"
            risk_score = 10
            threat_type = "Verified Infrastructure Traffic"
            severity = "LOW"
            explanation = f"Flow to known legitimate host '{dest_host}' suppressed via active allowlist."
        elif is_suspicious_port or is_exfiltration:
            verdict = "CRITICAL_ANOMALY"
            risk_score = 92 if is_exfiltration and is_suspicious_port else 85
            severity = "CRITICAL"
            threat_type = "Data Exfiltration / Rogue C2 Channel" if is_exfiltration else f"Suspicious Port Activity ({port_alert_reason})"
            explanation = f"Detected high-risk pattern: Destination Port {dst_port} ({port_alert_reason}). Upload volume: {round(bytes_sent/1024, 1)} KB."
        elif is_ml_anomaly and raw_score < -0.05:
            verdict = "SUSPICIOUS_ANOMALY"
            risk_score = int(min(80, max(45, (abs(raw_score) * 400))))
            severity = "HIGH" if risk_score > 65 else "MEDIUM"
            threat_type = "Behavioral Flow Outlier (Isolation Forest Trigger)"
            explanation = f"Statistically anomalous network behavior (Anomaly Score: {round(raw_score, 4)}). Uncharacteristic byte distribution or duration."
        else:
            verdict = "NORMAL"
            risk_score = int(max(5, min(30, 20 + raw_score * 50)))
            severity = "LOW"
            threat_type = "Standard Network Operation"
            explanation = "Traffic conforms to expected baseline communication patterns."

        return {
            "flow_id": flow.get("id", "flow-" + str(np.random.randint(1000, 9999))),
            "protocol": protocol,
            "src_ip": flow.get("src_ip", "192.168.1.45"),
            "dst_ip": flow.get("dst_ip", "104.21.26.156"),
            "dst_port": dst_port,
            "dest_host": dest_host,
            "verdict": verdict,
            "severity": severity,
            "risk_score": risk_score,
            "threat_type": threat_type,
            "anomaly_score": round(raw_score, 4),
            "is_allowlisted": is_allowlisted,
            "explanation": explanation,
            "recommended_action": "Isolate host or terminate connection immediately." if severity in ["CRITICAL", "HIGH"] else "No action required."
        }

    def batch_analyze(self, flows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return [self.analyze_flow(f) for f in flows]
