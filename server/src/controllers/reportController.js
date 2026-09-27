const db = require('../config/db');

exports.generateExecutiveReport = async (req, res) => {
  try {
    const user = db.users[0];
    const totalIncidents = db.incidents.length;
    const resolvedCount = db.incidents.filter(i => i.status === 'CONTAINED').length;
    const openCritical = db.incidents.filter(i => i.status === 'OPEN' && i.severity === 'CRITICAL').length;

    const report = {
      report_id: 'RPT-EXECUTIVE-' + Date.now(),
      generated_at: new Date().toISOString(),
      company: user.company,
      prepared_for: user.name,
      security_posture_score: db.postureState.score,
      posture_grade: db.postureState.grade,
      kpis: {
        total_incidents_logged: totalIncidents,
        contained_threats: resolvedCount,
        open_critical_alerts: openCritical,
        estimated_financial_loss_prevented: '₹28,40,000'
      },
      nist_csf_summary: db.postureState.nist_alignment || {
        IDENTIFY: 70, PROTECT: 65, DETECT: 80, RESPOND: 60, RECOVER: 55
      },
      critical_incidents: db.incidents.filter(i => i.severity === 'CRITICAL'),
      actionable_executive_priorities: [
        'Enforce mandatory FIDO2 hardware MFA on all corporate email accounts.',
        'Schedule weekly immutable cloud backups for accounting databases.',
        'Conduct simulated quarterly quishing and social engineering drills for finance staff.'
      ],
      compliance_status: {
        cert_in_guidelines: openCritical === 0 ? 'COMPLIANT' : 'INCIDENT_REPORTING_TRIGGERED',
        dpdp_act_2023_readiness: 'MODERATE_READY'
      }
    };

    return res.status(200).json({ success: true, data: report });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
