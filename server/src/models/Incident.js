const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    threat_type: {
      type: String,
      required: true,
      index: true
    },
    severity: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'],
      default: 'MEDIUM',
      index: true
    },
    status: {
      type: String,
      enum: ['OPEN', 'CONTAINED', 'RESOLVED', 'FALSE_POSITIVE'],
      default: 'OPEN',
      index: true
    },
    source_ip: {
      type: String,
      default: 'Unknown'
    },
    target_asset: {
      type: String,
      required: true
    },
    detected_at: {
      type: Date,
      default: Date.now
    },
    raw_details: {
      type: String,
      default: ''
    },
    bluf: {
      type: String,
      default: ''
    },
    business_impact: {
      financial_exposure: { type: String, default: 'Under Assessment' },
      operational_downtime: { type: String, default: 'Minimal' },
      regulatory_risk: { type: String, default: 'Low' }
    },
    remediation_status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED'],
      default: 'PENDING'
    },
    action_taken: {
      type: String,
      default: null
    },
    resolved_at: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Incident', incidentSchema);
