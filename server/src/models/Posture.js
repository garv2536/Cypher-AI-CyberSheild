const mongoose = require('mongoose');

const postureSchema = new mongoose.Schema(
  {
    mfa_enabled: { type: Boolean, default: true },
    automated_backups: { type: Boolean, default: true },
    firewall_active: { type: Boolean, default: true },
    employee_training: { type: Boolean, default: false },
    incident_plan_exists: { type: Boolean, default: false },
    patch_management: { type: Boolean, default: true },
    network_segmentation: { type: Boolean, default: false },
    edr_installed: { type: Boolean, default: true },
    score: { type: Number, default: 67 },
    grade: { type: String, default: 'C (Vulnerable / Gaps Identified)' },
    status: { type: String, default: 'NEEDS_IMPROVEMENT' },
    nist_alignment: {
      IDENTIFY: { type: Number, default: 70 },
      PROTECT: { type: Number, default: 65 },
      DETECT: { type: Number, default: 80 },
      RESPOND: { type: Number, default: 60 },
      RECOVER: { type: Number, default: 55 }
    },
    checklist: { type: Array, default: [] },
    last_updated: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Posture', postureSchema);
