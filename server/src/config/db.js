const bcrypt = require('bcryptjs');

// In-memory data store with default realistic MSME security data
class DataStore {
  constructor() {
    const salt = bcrypt.genSaltSync(10);

    this.users = [
      {
        id: 'usr-1',
        email: 'admin@bizraksha.local',
        passwordHash: bcrypt.hashSync('admin123', salt),
        name: 'Priya Sharma (Owner)',
        company: 'Vanguard Auto Components Pvt Ltd',
        role: 'BUSINESS_OWNER',
        avatar: 'PS',
        created_at: new Date().toISOString()
      },
      {
        id: 'usr-2',
        email: 'rahul.verma@vanguardauto.in',
        passwordHash: bcrypt.hashSync('securepass', salt),
        name: 'Rahul Verma (IT Lead)',
        company: 'Vanguard Auto Components Pvt Ltd',
        role: 'IT_SECURITY_LEAD',
        avatar: 'RV',
        created_at: new Date().toISOString()
      }
    ];

    this.incidents = [
      {
        id: 'INC-849201',
        title: 'Adversary-in-the-Middle (AiTM) Phishing Detected',
        threat_type: 'CREDENTIAL_PHISHING',
        severity: 'CRITICAL',
        status: 'OPEN',
        source_ip: '194.26.29.112',
        target_asset: 'Workstation-Accounts-02 (accounting@vanguardauto.in)',
        detected_at: new Date(Date.now() - 15 * 60000).toISOString(),
        raw_details: 'User clicked spoofed invoice link (gst-tax-invoicing-portal.xyz/verify). Fake login form with reverse proxy credential harvesting.',
        bluf: 'URGENT ACTION: Revoke active M365 session tokens immediately to block attacker from accessing accounting mailbox and diverting client invoice payments.',
        business_impact: {
          financial_exposure: '₹5,00,000 – ₹18,00,000 in fraudulent vendor invoice diversion',
          operational_downtime: '4 to 8 hours accounting freeze',
          regulatory_risk: 'CERT-In incident reporting mandatory within 6 hours under 2023 directives'
        },
        remediation_status: 'PENDING'
      },
      {
        id: 'INC-732910',
        title: 'High-Volume Outbound C2 Beaconing (Port 2053)',
        threat_type: 'DATA_EXFILTRATION_C2',
        severity: 'HIGH',
        status: 'OPEN',
        source_ip: '172.67.71.89 (mobilespy.at)',
        target_asset: 'Android Device (Samsung A16 - Sales Lead)',
        detected_at: new Date(Date.now() - 45 * 60000).toISOString(),
        raw_details: 'Stalkerware/C2 exfiltration pattern matching Cloudflare-fronted non-standard port 2053 with abnormal upload traffic volume.',
        bluf: 'CRITICAL ACTION: Quarantine sales device from office Wi-Fi and block destination IP 172.67.71.89 on firewall.',
        business_impact: {
          financial_exposure: '₹3,50,000 (Customer contact lists and proprietary pricing theft)',
          operational_downtime: '2 hours device re-imaging',
          regulatory_risk: 'DPDP Act 2023 compliance inquiry if customer PII leaked'
        },
        remediation_status: 'PENDING'
      },
      {
        id: 'INC-518290',
        title: 'Dual-Module QR Code Evasion Attempt in Invoice PDF',
        threat_type: 'QUISHING_EVASION',
        severity: 'HIGH',
        status: 'CONTAINED',
        source_ip: '45.142.214.90',
        target_asset: 'Mail Gateway (inbox@vanguardauto.in)',
        detected_at: new Date(Date.now() - 180 * 60000).toISOString(),
        raw_details: 'Dual-layer QR code inside vendor invoice attachment. Sub-module encoded clean URL, but camera scan triggered malicious payment gateway.',
        bluf: 'DECISION EXECUTED: Attachment quarantined; sender domain blacklisted at mail gateway.',
        business_impact: {
          financial_exposure: 'Prevented ₹2,40,000 fake vendor settlement',
          operational_downtime: '0 hours (Preempted at gateway)',
          regulatory_risk: 'Logged for quarterly audit'
        },
        remediation_status: 'RESOLVED'
      }
    ];

    this.scanLogs = [];
    this.postureState = {
      mfa_enabled: true,
      automated_backups: true,
      firewall_active: true,
      employee_training: false,
      incident_plan_exists: false,
      patch_management: true,
      network_segmentation: false,
      edr_installed: true,
      score: 67,
      grade: 'C (Vulnerable / Gaps Identified)',
      last_updated: new Date().toISOString()
    };
  }
}

const db = new DataStore();
module.exports = db;
