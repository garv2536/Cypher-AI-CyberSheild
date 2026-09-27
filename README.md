# 🛡️ BizRaksha (Cypher: AI-Powered CyberShield for MSMEs)

> **Vision:** *"Smart AI. Strong Security. Safer Business."*  
> **Project ID:** `2026M3CSEAIB02`  
> **Department:** Computer Science & Engineering (AI), ABESIT / AKTU (Session 2026-27)

---

## 📖 Executive Overview

**BizRaksha** is an intelligent, low-friction, AI-driven cybersecurity platform designed specifically for Micro, Small, and Medium Enterprises (MSMEs). MSMEs are the primary targets of ransomware, quishing, business email compromise (BEC), and data breaches, yet they are excluded from enterprise-grade SIEM/EDR platforms due to prohibitive costs and high operational complexity.

BizRaksha acts as an **autonomous virtual SOC**:
1. **Real-Time Threat Detection:** Inspects phishing URLs, dual-module QR codes (quishing), and network flow anomalies.
2. **Behavioral Anomaly Engine:** Utilizes unsupervised Isolation Forests and post-scoring allowlists to surface stealthy C2 beaconing and exfiltration.
3. **Executive BLUF Risk Translation:** Translates raw technical CVEs and IOCs into plain-English business risk briefings (financial loss estimation, downtime, and 1-click containment directives).
4. **NIST CSF 2.0 & CERT-In Compliance:** Calibrates cyber-defense posture against national standards with instant audit export.

---

## 🏛️ System Architecture

```
                                  ┌────────────────────────┐
                                  │ React.js Client (Vite) │
                                  │ • Executive Dashboard  │
                                  │ • Multi-Modal Scanner  │
                                  │ • 1-Click Action Hub   │
                                  └───────────▲────────────┘
                                              │ HTTP / WebSockets
                                  ┌───────────▼────────────┐
                                  │ Node.js / Express API  │
                                  │ (Port 5000)            │
                                  │ • Socket.io Telemetry  │
                                  │ • In-Memory Store      │
                                  │ • 1-Click Remediation  │
                                  └───────────▲────────────┘
                                              │ REST Microservice Calls
                                  ┌───────────▼────────────┐
                                  │ FastAPI AI/ML Engine   │
                                  │ (Port 8000, Python)    │
                                  │ • Isolation Forest NIDS│
                                  │ • Phishing URL Entropy │
                                  │ • Dual-Module QR Check │
                                  │ • BLUF Risk Translator │
                                  └────────────────────────┘
```

---

## 🚀 How to Run the Entire Application

### Quick Start (One Command)
Run all 3 tiers concurrently (Backend on `5000`, Client on `5173`, AI Engine on `8000`):

```bash
npm run dev
```

### Running Services Individually:
1. **Python AI Microservice:**
   ```bash
   cd ai_engine
   .\venv\Scripts\python run.py
   ```
2. **Backend Server (Express + Socket.io):**
   ```bash
   npm run start:server
   ```
3. **Frontend Dashboard (React + Vite):**
   ```bash
   npm run start:client
   ```

Then open **`http://localhost:5173`** in your browser.

---

## 🔬 Grounded in Published Research

* **Executive CTI Translation (Aguilar, 2026):** Implements Strategy S4 (Bottom Line Up Front + Minto Pyramid Principle) for translating raw CVEs and logs into executive risk assessments.
* **Dual-Module QR Evasion Detection (Legere, 2026):** Detects sub-module pixel-level overlays designed to bypass center-pixel email gateway decoders.
* **Network Flow Anomaly Detection (Sinanian, 2026):** Employs unsupervised Isolation Forest models on network traffic paired with post-scoring allowlist suppression.
* **Proactive MSME Protection Framework (Patil et al., 2023):** Aligns organizational posture and incident response with NIST CSF 2.0 and CERT-In 6-hour disclosure guidelines.

---

## 👥 Project Team

* **Harsh Kumar** (Roll No: 2402901520130)
* **Hemil Rawat** (Roll No: 2402901520136)
* **Hardik Shama** (Roll No: 2402901520126)
* **Garv Pratap Singh** (Roll No: 2402901520119)
