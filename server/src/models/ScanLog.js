const mongoose = require('mongoose');

const scanLogSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    type: {
      type: String,
      enum: ['URL', 'QR_CODE', 'NETWORK_FLOW', 'EMAIL_TEXT'],
      required: true
    },
    target: {
      type: String,
      required: true
    },
    risk_score: {
      type: Number,
      required: true
    },
    verdict: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ScanLog', scanLogSchema);
