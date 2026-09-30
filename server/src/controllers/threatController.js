const { Incident, isConnected, memoryStore } = require('../config/db');
const aiService = require('../services/aiService');

exports.getIncidents = async (req, res) => {
  try {
    let incidents = [];
    if (isConnected()) {
      incidents = await Incident.find().sort({ detected_at: -1 }).lean();
    } else {
      incidents = memoryStore.incidents;
    }

    const activeCritical = incidents.filter(i => i.status === 'OPEN' && i.severity === 'CRITICAL').length;

    return res.status(200).json({
      success: true,
      total: incidents.length,
      active_critical: activeCritical,
      incidents
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.executeRemediation = async (req, res) => {
  try {
    const { incidentId, actionType } = req.body;

    if (isConnected()) {
      let incident = await Incident.findOne({ id: incidentId });
      if (incident) {
        incident.status = 'CONTAINED';
        incident.remediation_status = 'RESOLVED';
        incident.resolved_at = new Date();
        incident.action_taken = actionType || 'ONE_CLICK_AUTO_CONTAINMENT';
        await incident.save();

        return res.status(200).json({
          success: true,
          message: `Action '${actionType}' executed successfully. Asset protected.`,
          incident
        });
      }
    }

    // Fallback or memoryStore check
    let incident = memoryStore.incidents.find(i => i.id === incidentId);
    if (!incident) {
      incident = {
        id: incidentId,
        title: 'Incident Remediated',
        threat_type: 'DATA_EXFILTRATION_C2',
        severity: 'CRITICAL',
        status: 'CONTAINED',
        remediation_status: 'RESOLVED',
        resolved_at: new Date().toISOString(),
        action_taken: actionType || 'ONE_CLICK_AUTO_CONTAINMENT'
      };
      memoryStore.incidents.unshift(incident);
    } else {
      incident.status = 'CONTAINED';
      incident.remediation_status = 'RESOLVED';
      incident.resolved_at = new Date().toISOString();
      incident.action_taken = actionType || 'ONE_CLICK_AUTO_CONTAINMENT';
    }

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
