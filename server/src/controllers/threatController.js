const db = require('../config/db');
const aiService = require('../services/aiService');

exports.getIncidents = async (req, res) => {
  return res.status(200).json({
    success: true,
    total: db.incidents.length,
    active_critical: db.incidents.filter(i => i.status === 'OPEN' && i.severity === 'CRITICAL').length,
    incidents: db.incidents
  });
};

exports.executeRemediation = async (req, res) => {
  try {
    const { incidentId, actionType } = req.body;
    const incident = db.incidents.find(i => i.id === incidentId);

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    // Apply action
    incident.status = 'CONTAINED';
    incident.remediation_status = 'RESOLVED';
    incident.resolved_at = new Date().toISOString();
    incident.action_taken = actionType || 'ONE_CLICK_AUTO_CONTAINMENT';

    return res.status(200).json({
      success: true,
      message: `Action '${actionType}' executed successfully. Asset protected.`,
      incident
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.translateTechnicalThreat = async (req, res) => {
  try {
    const { title, threat_type, severity, raw_details, target_asset, source_ip, cve_id } = req.body;
    const translation = await aiService.translateBLUF({
      title,
      threat_type,
      severity,
      raw_details,
      target_asset,
      source_ip,
      cve_id
    });

    return res.status(200).json({ success: true, data: translation });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
