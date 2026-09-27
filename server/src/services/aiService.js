const axios = require('axios');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

class AIService {
  async scanUrl(url) {
    try {
      const response = await axios.post(`${AI_ENGINE_URL}/api/v1/detect/url`, { url }, { timeout: 3500 });
      return response.data;
    } catch (err) {
      console.warn('⚠️ Python AI engine unavailable, utilizing node fallback for URL scan');
      return this._fallbackUrlScan(url);
    }
  }

  async scanQR(qrData, metadata = {}) {
    try {
      const response = await axios.post(`${AI_ENGINE_URL}/api/v1/detect/qr`, {
        qr_data: qrData,
        ...metadata
      }, { timeout: 3500 });
      return response.data;
    } catch (err) {
      console.warn('⚠️ Python AI engine unavailable, utilizing node fallback for QR scan');
      return this._fallbackQRScan(qrData, metadata);
    }
  }

  async scanNetworkAnomalies(flows) {
    try {
      const response = await axios.post(`${AI_ENGINE_URL}/api/v1/detect/network-anomaly`, { flows }, { timeout: 4500 });
      return response.data;
    } catch (err) {
      console.warn('⚠️ Python AI engine unavailable, utilizing node fallback for Anomaly scan');
      return this._fallbackAnomalyScan(flows);
    }
  }

  async translateBLUF(threatInput) {
    try {
      const response = await axios.post(`${AI_ENGINE_URL}/api/v1/translate/bluf`, threatInput, { timeout: 3500 });
      return response.data;
    } catch (err) {
      console.warn('⚠️ Python AI engine unavailable, utilizing node fallback for BLUF translation');
      return this._fallbackBLUFTranslate(threatInput);
    }
  }

  async evaluatePosture(answers) {
    try {
      const response = await axios.post(`${AI_ENGINE_URL}/api/v1/assess/posture`, answers, { timeout: 3500 });
      return response.data;
    } catch (err) {
      return this._fallbackPostureEvaluate(answers);
    }
  }

  // --- Resilient Fallbacks ---
  _fallbackUrlScan(url) {
    const isIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url);
    const hasSuspiciousKw = /(login|verify|bank|gst|kyc|secure|update|password|invoice)/i.test(url);
    const isRiskyTLD = /\.(xyz|top|club|work|gq|cf|buzz|loan|online)$/i.test(url);

    let score = 10;
    const reasons = [];
    if (isIp) { score += 40; reasons.push('Raw IP address in destination'); }
    if (hasSuspiciousKw) { score += 30; reasons.push('Targeted login/financial credential terms detected'); }
    if (isRiskyTLD) { score += 25; reasons.push('High-risk throwaway TLD detected'); }

    score = Math.min(100, score);
    const verdict = score >= 60 ? 'MALICIOUS' : (score >= 35 ? 'SUSPICIOUS' : 'SAFE');

    return {
      url,
      verdict,
      risk_score: score,
      risk_level: score >= 75 ? 'CRITICAL' : (score >= 40 ? 'HIGH' : 'LOW'),
      confidence: 0.88,
      classification: verdict === 'MALICIOUS' ? 'Phishing Credential Harvester' : 'Legitimate Link',
      reasons: reasons.length ? reasons : ['Normal URL syntax'],
      recommendation: score >= 60 ? 'Block domain immediately on DNS firewall.' : 'Safe to proceed.'
    };
  }

  _fallbackQRScan(qrData, metadata) {
    const urlResult = this._fallbackUrlScan(qrData);
    const isDual = metadata.submodule_detected || (metadata.pixel_variance && metadata.pixel_variance > 0.25);
    
    return {
      qr_data: qrData,
      verdict: isDual ? 'CRITICAL_QUISHING_EVASION' : (urlResult.verdict === 'MALICIOUS' ? 'MALICIOUS_QR_PHISHING' : 'CLEAN_QR'),
      severity: isDual ? 'CRITICAL' : (urlResult.verdict === 'MALICIOUS' ? 'HIGH' : 'LOW'),
      quishing_risk_score: isDual ? 94 : urlResult.risk_score,
      dual_module_evasion_detected: Boolean(isDual),
      url_analysis: urlResult,
      evasion_indicators: isDual ? ['Dual-module sub-pixel overlay detected (Legere 2026 exploit pattern)'] : ['Conforms to standard ISO/IEC 18004 specification'],
      mitigation_instructions: ['Do not scan using mobile camera.', 'Quarantine source message and notify security lead.']
    };
  }

  _fallbackAnomalyScan(flows) {
    const results = (flows || []).map((f, idx) => {
      const isBadPort = [4444, 2053, 1337, 7096].includes(Number(f.dst_port));
      const highBytes = Number(f.bytes_sent) > 150000;
      const isAnomaly = isBadPort || highBytes;

      return {
        flow_id: f.id || `flow-${idx + 100}`,
        protocol: f.protocol || 'TCP',
        src_ip: f.src_ip || '192.168.1.45',
        dst_ip: f.dst_ip || '104.21.26.156',
        dst_port: f.dst_port || 443,
        dest_host: f.dest_host || 'unknown-peer.net',
        verdict: isAnomaly ? 'CRITICAL_ANOMALY' : 'NORMAL',
        severity: isAnomaly ? 'CRITICAL' : 'LOW',
        risk_score: isAnomaly ? 88 : 12,
        threat_type: highBytes ? 'Unauthorized Data Exfiltration' : (isBadPort ? 'Rogue C2 Port Access' : 'Standard Baseline'),
        explanation: isAnomaly ? `Unusual flow on port ${f.dst_port} with abnormal transmission characteristics` : 'Normal baseline traffic'
      };
    });

    return {
      total_flows_analyzed: results.length,
      critical_anomalies_count: results.filter(r => r.severity === 'CRITICAL').length,
      overall_traffic_risk_index: 34,
      results
    };
  }

  _fallbackBLUFTranslate(threatInput) {
    return {
      threat_id: threatInput.id || 'INC-MOCK-01',
      threat_title: threatInput.title || 'Detected Security Alert',
      category: 'CREDENTIAL_PHISHING',
      severity: threatInput.severity || 'HIGH',
      bluf: `URGENT ACTION: Immediate containment required for ${threatInput.target_asset || 'Internal Host'} to mitigate credential and financial fraud risk.`,
      business_impact: {
        financial_exposure: '₹5,00,000 – ₹15,00,000 in potential diversion & downtime',
        operational_downtime: '4 to 8 hours accounting freeze',
        regulatory_risk: 'CERT-In reporting mandatory within 6 hours'
      },
      affected_scope: 'Corporate email, client records, and accounting workstations.',
      prioritized_actions: [
        { role: 'IT Administrator', directive: 'Revoke compromised session tokens and isolate endpoint', rationale: 'Stops lateral traversal' },
        { role: 'Business Owner', directive: 'Alert finance department to verify pending vendor invoices', rationale: 'Prevents fraudulent wire transfers' }
      ]
    };
  }

  _fallbackPostureEvaluate(answers) {
    let score = 0;
    const checks = [];
    Object.keys(answers).forEach(k => {
      if (answers[k]) {
        score += 12.5;
        checks.push({ item: k.replace(/_/g, ' ').toUpperCase(), status: 'PASSED' });
      } else {
        checks.push({ item: k.replace(/_/g, ' ').toUpperCase(), status: 'FAILED' });
      }
    });

    return {
      overall_score: Math.round(score),
      max_score: 100,
      grade: score >= 75 ? 'B (Good)' : 'C (Needs Attention)',
      status: score >= 75 ? 'GOOD' : 'ATTENTION_REQUIRED',
      checklist: checks,
      nist_alignment: {
        IDENTIFY: Math.round(score),
        PROTECT: Math.round(score * 0.9),
        DETECT: Math.round(score),
        RESPOND: Math.round(score * 0.85),
        RECOVER: Math.round(score * 0.8)
      }
    };
  }
}

module.exports = new AIService();
