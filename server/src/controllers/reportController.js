const { User, Incident, Posture, isConnected, memoryStore } = require('../config/db');

exports.generateExecutiveReport = async (req, res) => {
  try {
    let user = null;
    let incidents = [];
    let posture = null;

    if (isConnected()) {
      user = (await User.findOne()) || {
        name: 'Priya Sharma (Owner)',
        company: 'Vanguard Auto Components Pvt Ltd'
      };
      incidents = await Incident.find().lean();
      posture = (await Posture.findOne().sort({ createdAt: -1 })) || {
        score: 67,
        grade: 'C (Vulnerable / Gaps Identified)',
        nist_alignment: { IDENTIFY: 70, PROTECT: 65, DETECT: 80, RESPOND: 60, RECOVER: 55 }
      };
    } else {
      user = memoryStore.users[0] || {
        name: 'Priya Sharma (Owner)',
        company: 'Vanguard Auto Components Pvt Ltd'
      };
      incidents = memoryStore.incidents;
      posture = memoryStore.postureState;
    }

    const totalIncidents = incidents.length;
    const resolvedCount = incidents.filter(i => i.status === 'CONTAINED' || i.status === 'RESOLVED').length;
    const openCritical = incidents.filter(i => i.status === 'OPEN' && i.severity === 'CRITICAL').length;
    const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL');

    const report = {
      report_id: 'RPT-EXECUTIVE-' + Date.now(),
      generated_at: new Date().toISOString(),
      company: user.company,
      prepared_for: user.name,
      security_posture_score: posture.score,
      posture_grade: posture.grade,
      kpis: {
        total_incidents_logged: totalIncidents,
        contained_threats: resolvedCount,
        open_critical_alerts: openCritical,
        estimated_financial_loss_prevented: '₹28,40,000'
      },
      nist_csf_summary: posture.nist_alignment || {
        IDENTIFY: 70, PROTECT: 65, DETECT: 80, RESPOND: 60, RECOVER: 55
      },
      critical_incidents: criticalIncidents,
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
