import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .detectors.phishing_detector import PhishingDetector
from .detectors.anomaly_detector import NetworkAnomalyDetector
from .detectors.qr_analyzer import QRAnalyzer
from .detectors.bluf_translator import BLUFRiskTranslator

app = FastAPI(
    title="BizRaksha AI Microservice",
    description="AI/ML Threat Detection, Behavioral Anomaly Analysis, and Executive Risk Translation for MSMEs",
    version="1.0.0"
)

# Enable CORS for local Node backend & React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize singletons
phishing_detector = PhishingDetector()
anomaly_detector = NetworkAnomalyDetector()
qr_analyzer = QRAnalyzer()
bluf_translator = BLUFRiskTranslator()

class URLScanRequest(BaseModel):
    url: str

class FlowLogItem(BaseModel):
    id: Optional[str] = None
    protocol: Optional[str] = "TCP"
    src_ip: Optional[str] = "192.168.1.50"
    dst_ip: Optional[str] = "104.21.26.156"
    dst_port: Optional[int] = 443
    dest_host: Optional[str] = ""
    duration: Optional[float] = 1.0
    bytes_sent: Optional[float] = 500.0
    bytes_recv: Optional[float] = 1200.0
    packet_count: Optional[int] = 10

class AnomalyBatchRequest(BaseModel):
    flows: List[FlowLogItem]

class QRScanRequest(BaseModel):
    qr_data: str
    submodule_detected: Optional[bool] = False
    pixel_variance: Optional[float] = 0.0
    module_size: Optional[int] = 29
    submodule_size: Optional[int] = 0

class ThreatTranslateRequest(BaseModel):
    id: Optional[str] = None
    title: str
    threat_type: str
    severity: Optional[str] = "HIGH"
    raw_details: Optional[str] = ""
    source_ip: Optional[str] = "Unknown"
    target_asset: Optional[str] = "Corporate Workstation / Server"
    cve_id: Optional[str] = ""

class PostureAnswers(BaseModel):
    mfa_enabled: bool
    automated_backups: bool
    firewall_active: bool
    employee_training: bool
    incident_plan_exists: bool
    patch_management: bool
    network_segmentation: bool
    edr_installed: bool

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "BizRaksha AI Microservice",
        "models_loaded": ["PhishingClassifier", "IsolationForestNIDS", "QRQuishingAnalyzer", "BLUFRiskTranslator"]
    }

@app.post("/api/v1/detect/url")
def detect_url(req: URLScanRequest):
    if not req.url:
        raise HTTPException(status_code=400, detail="URL cannot be empty")
    return phishing_detector.analyze(req.url)

@app.post("/api/v1/detect/network-anomaly")
def detect_anomalies(req: AnomalyBatchRequest):
    flows_dict = [f.model_dump() for f in req.flows]
    results = anomaly_detector.batch_analyze(flows_dict)
    
    total = len(results)
    anomalies = [r for r in results if r["severity"] in ["CRITICAL", "HIGH"]]
    risk_index = int(sum(r["risk_score"] for r in results) / max(1, total))

    return {
        "total_flows_analyzed": total,
        "critical_anomalies_count": len(anomalies),
        "overall_traffic_risk_index": risk_index,
        "results": results
    }

@app.post("/api/v1/detect/qr")
def detect_qr(req: QRScanRequest):
    metadata = {
        "submodule_detected": req.submodule_detected,
        "pixel_variance": req.pixel_variance,
        "module_size": req.module_size,
        "submodule_size": req.submodule_size
    }
    return qr_analyzer.analyze_qr_payload(req.qr_data, metadata)

@app.post("/api/v1/translate/bluf")
def translate_threat_bluf(req: ThreatTranslateRequest):
    return bluf_translator.translate_threat(req.model_dump())

@app.post("/api/v1/assess/posture")
def assess_posture(answers: PostureAnswers):
    # NIST CSF 2.0 evaluation model
    score = 0
    checks = []
    
    if answers.mfa_enabled:
        score += 15
        checks.append({"item": "MFA across Accounts", "status": "PASSED", "weight": 15})
    else:
        checks.append({"item": "MFA across Accounts", "status": "FAILED", "weight": 15, "remediation": "Enforce MFA on Microsoft 365, Google Workspace, and banking accounts."})

    if answers.automated_backups:
        score += 15
        checks.append({"item": "Automated Offline Backups (3-2-1 Rule)", "status": "PASSED", "weight": 15})
    else:
        checks.append({"item": "Automated Offline Backups", "status": "FAILED", "weight": 15, "remediation": "Deploy daily automated cloud backups with immutable versioning."})

    if answers.firewall_active:
        score += 12
        checks.append({"item": "Perimeter & Host Firewall", "status": "PASSED", "weight": 12})
    else:
        checks.append({"item": "Perimeter & Host Firewall", "status": "FAILED", "weight": 12, "remediation": "Enable stateful firewall on router and activate Windows Defender Firewall on all PCs."})

    if answers.patch_management:
        score += 15
        checks.append({"item": "Timely Patch & OS Updates", "status": "PASSED", "weight": 15})
    else:
        checks.append({"item": "Timely Patch Management", "status": "FAILED", "weight": 15, "remediation": "Enable automatic security updates across all operating systems."})

    if answers.employee_training:
        score += 13
        checks.append({"item": "Quarterly Staff Phishing Training", "status": "PASSED", "weight": 13})
    else:
        checks.append({"item": "Employee Cybersecurity Awareness", "status": "FAILED", "weight": 13, "remediation": "Conduct bi-annual phishing simulations and safety workshops."})

    if answers.incident_plan_exists:
        score += 10
        checks.append({"item": "Documented Incident Response Plan", "status": "PASSED", "weight": 10})
    else:
        checks.append({"item": "Incident Response Plan", "status": "FAILED", "weight": 10, "remediation": "Establish simple 1-page emergency checklist (contact CERT-In, isolate network, notify bank)."})

    if answers.network_segmentation:
        score += 10
        checks.append({"item": "Guest & IoT Network Isolation", "status": "PASSED", "weight": 10})
    else:
        checks.append({"item": "Network Segmentation", "status": "FAILED", "weight": 10, "remediation": "Isolate office Wi-Fi from guest networks and printer/IoT VLANs."})

    if answers.edr_installed:
        score += 10
        checks.append({"item": "Endpoint Anti-Malware / Detection", "status": "PASSED", "weight": 10})
    else:
        checks.append({"item": "Endpoint Detection", "status": "FAILED", "weight": 10, "remediation": "Deploy managed endpoint anti-malware on all employee laptops."})

    # Grade determination
    if score >= 85:
        grade = "A (Robust / Cyber-Resilient)"
        status = "EXCELLENT"
    elif score >= 70:
        grade = "B (Moderate / Well-Protected)"
        status = "GOOD"
    elif score >= 50:
        grade = "C (Vulnerable / Gaps Identified)"
        status = "ATTENTION_REQUIRED"
    else:
        grade = "D (High Risk / Urgent Action Required)"
        status = "CRITICAL"

    return {
        "overall_score": score,
        "max_score": 100,
        "grade": grade,
        "status": status,
        "checklist": checks,
        "nist_alignment": {
            "IDENTIFY": min(100, int(score * 1.05)),
            "PROTECT": min(100, int(score * 0.95)),
            "DETECT": min(100, int(score * 1.0)),
            "RESPOND": min(100, int(score * 0.9)),
            "RECOVER": min(100, int(score * 0.85))
        }
    }
