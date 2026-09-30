const { Incident, isConnected, memoryStore } = require('../config/db');

const SAMPLE_EVENTS = [
  {
    type: 'FLOW_BLOCKED',
    severity: 'LOW',
    message: 'DNS request to updates.microsoft.com resolved and validated.',
    source: '192.168.1.102',
    destination: 'update.microsoft.com',
    action: 'ALLOWLIST_PASS'
  },
  {
    type: 'SUSPICIOUS_PROBE',
    severity: 'MEDIUM',
    message: 'Repeated external port probe on WAN interface port 8080.',
    source: '185.220.101.5',
    destination: 'Firewall-WAN-01',
    action: 'RATE_LIMITED'
  },
  {
    type: 'PHISHING_INVOICE',
    severity: 'HIGH',
    message: 'Suspicious email attachment (GST_Invoice_March.pdf.exe) blocked in sales inbox.',
    source: 'vendor-billing@support-tally-update.xyz',
    destination: 'sales@vanguardauto.in',
    action: 'QUARANTINED'
  },
  {
    type: 'OUTBOUND_SPIKE',
    severity: 'CRITICAL',
    message: 'Unusual outbound data transfer (340 MB) from Accounting PC to unrecognized foreign IP.',
    source: '192.168.1.108',
    destination: '45.142.214.90',
    action: 'ISOLATION_RECOMMENDED'
  },
  {
    type: 'MFA_CHALLENGE',
    severity: 'LOW',
    message: 'Successful employee login with FIDO2 MFA token verified.',
    source: '192.168.1.115',
    destination: 'Identity Perimeter',
    action: 'AUTHENTICATED'
  }
];

class SimulatedLiveTraffic {
  constructor() {
    this.intervalId = null;
  }

  start(io) {
    if (this.intervalId) return;
    
    console.log('📡 Real-time simulated telemetry engine started.');

    this.intervalId = setInterval(async () => {
      const event = SAMPLE_EVENTS[Math.floor(Math.random() * SAMPLE_EVENTS.length)];
      const livePayload = {
        ...event,
        id: 'EVT-' + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toISOString()
      };

      io.emit('telemetry_event', livePayload);

      // Randomly inject an active critical incident if trigger fires
      if (event.severity === 'CRITICAL' && Math.random() > 0.6) {
        const incidentId = 'INC-' + Math.floor(100000 + Math.random() * 900000);
        const newIncident = {
          id: incidentId,
          title: 'Automated Isolation: ' + event.message,
          threat_type: 'DATA_EXFILTRATION_C2',
          severity: 'CRITICAL',
          status: 'OPEN',
          source_ip: event.source,
          target_asset: 'Workstation-192.168.1.108',
          detected_at: new Date(),
          raw_details: event.message,
          bluf: 'CRITICAL ACTION: Authorize one-click network isolation to prevent unauthorized file exfiltration.',
          business_impact: {
            financial_exposure: '₹8,00,000 in proprietary file exposure',
            operational_downtime: 'Under 1 hour if isolated promptly',
            regulatory_risk: 'DPDP Act compliance alert logged'
          },
          remediation_status: 'PENDING'
        };

        try {
          if (isConnected()) {
            await Incident.create(newIncident);
          } else {
            memoryStore.incidents.unshift(newIncident);
          }
        } catch (err) {
          memoryStore.incidents.unshift(newIncident);
        }

        io.emit('new_incident_alert', newIncident);
      }
    }, 6000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

module.exports = new SimulatedLiveTraffic();
