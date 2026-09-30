const aiService = require('../services/aiService');
const { ScanLog, isConnected, memoryStore } = require('../config/db');

exports.scanUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, message: 'URL is required' });

    const result = await aiService.scanUrl(url);
    const scanId = 'SCAN-' + Date.now();

    const scanRecord = {
      id: scanId,
      type: 'URL',
      target: url,
      risk_score: result.risk_score,
      verdict: result.verdict,
      timestamp: new Date(),
      details: result
    };

    if (isConnected()) {
      await ScanLog.create(scanRecord);
    } else {
      memoryStore.scanLogs.unshift(scanRecord);
    }

    return res.status(200).json({ success: true, data: result, scanId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.scanQR = async (req, res) => {
  try {
    const { qr_data, submodule_detected, pixel_variance, module_size, submodule_size } = req.body;
    if (!qr_data) return res.status(400).json({ success: false, message: 'QR content/data is required' });

    const result = await aiService.scanQR(qr_data, {
      submodule_detected,
      pixel_variance,
      module_size,
      submodule_size
    });

    const scanId = 'SCAN-' + Date.now();
    const scanRecord = {
      id: scanId,
      type: 'QR_CODE',
      target: qr_data,
      risk_score: result.quishing_risk_score,
      verdict: result.verdict,
      timestamp: new Date(),
      details: result
    };

    if (isConnected()) {
      await ScanLog.create(scanRecord);
    } else {
      memoryStore.scanLogs.unshift(scanRecord);
    }

    return res.status(200).json({ success: true, data: result, scanId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.scanNetworkLogs = async (req, res) => {
  try {
    const { flows } = req.body;
    const flowsToScan = flows && Array.isArray(flows) && flows.length > 0 ? flows : [
      { id: 'f-1', protocol: 'TCP', src_ip: '192.168.1.102', dst_ip: '13.107.4.52', dst_port: 443, dest_host: 'update.microsoft.com', duration: 1.2, bytes_sent: 450, bytes_recv: 3200, packet_count: 8 },
      { id: 'f-2', protocol: 'TCP', src_ip: '192.168.1.108', dst_ip: '172.67.71.89', dst_port: 2053, dest_host: 'mobilespy.at', duration: 15.4, bytes_sent: 420000, bytes_recv: 2100, packet_count: 420 },
      { id: 'f-3', protocol: 'UDP', src_ip: '192.168.1.112', dst_ip: '135.148.103.143', dst_port: 7096, dest_host: 'umobix-stream.net', duration: 32.0, bytes_sent: 890000, bytes_recv: 1200, packet_count: 950 },
      { id: 'f-4', protocol: 'TCP', src_ip: '192.168.1.115', dst_ip: '142.250.190.46', dst_port: 443, dest_host: 'google.com', duration: 0.8, bytes_sent: 600, bytes_recv: 4500, packet_count: 12 },
      { id: 'f-5', protocol: 'TCP', src_ip: '192.168.1.120', dst_ip: '185.220.101.5', dst_port: 4444, dest_host: 'dark-tunnel.top', duration: 8.5, bytes_sent: 120000, bytes_recv: 800, packet_count: 150 }
    ];

    const result = await aiService.scanNetworkAnomalies(flowsToScan);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.scanEmailText = async (req, res) => {
  try {
    const { subject, sender, body } = req.body;
    const text = `${subject || ''} ${body || ''}`;
    
    // Check urgency, invoice bait, executive impersonation, wire transfer requests
    const isUrgent = /(urgent|immediate|suspended|overdue|terminated|final notice|penalty)/i.test(text);
    const isFinancial = /(bank|account|wire|transfer|payment|invoice|gst|tally|upi|neft|remittance)/i.test(text);
    const isCredHarvest = /(login|password|verify|click here|confirm credentials|update details)/i.test(text);
    const hasUrls = text.match(/https?:\/\/[^\s]+/g) || [];

    let score = 15;
    const flags = [];
    if (isUrgent) { score += 25; flags.push('Manufactured urgency / coercive psychological pressure trigger'); }
    if (isFinancial) { score += 25; flags.push('Financial redirection / payment interception theme'); }
    if (isCredHarvest) { score += 30; flags.push('Direct request for account verification or credential submission'); }
    if (hasUrls.length > 0) { score += 15; flags.push(`Contains ${hasUrls.length} embedded outbound link(s)`); }

    score = Math.min(100, score);
    const verdict = score >= 65 ? 'MALICIOUS_PHISHING' : (score >= 40 ? 'SUSPICIOUS' : 'LEGITIMATE');

    return res.status(200).json({
      success: true,
      data: {
        verdict,
        risk_score: score,
        risk_level: score >= 75 ? 'CRITICAL' : (score >= 45 ? 'HIGH' : 'LOW'),
        classification: verdict === 'MALICIOUS_PHISHING' ? 'Business Email Compromise (BEC) / Phishing' : 'Standard Email',
        extracted_urls: hasUrls,
        flags: flags.length ? flags : ['No prominent social engineering patterns identified'],
        recommendation: score >= 65 ? 'DO NOT click links or process payments. Verify with sender over phone.' : 'Email appears within normal parameters.'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getScanHistory = async (req, res) => {
  try {
    if (isConnected()) {
      const scans = await ScanLog.find().sort({ timestamp: -1 }).limit(25).lean();
      return res.status(200).json({ success: true, data: scans });
    } else {
      return res.status(200).json({ success: true, data: memoryStore.scanLogs.slice(0, 25) });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
