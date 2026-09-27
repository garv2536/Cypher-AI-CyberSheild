const db = require('../config/db');
const aiService = require('../services/aiService');

exports.getPosture = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: db.postureState
  });
};

exports.updatePosture = async (req, res) => {
  try {
    const answers = req.body;
    const evaluation = await aiService.evaluatePosture(answers);

    db.postureState = {
      ...answers,
      score: evaluation.overall_score,
      grade: evaluation.grade,
      status: evaluation.status,
      nist_alignment: evaluation.nist_alignment,
      checklist: evaluation.checklist,
      last_updated: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Security posture updated successfully',
      data: db.postureState
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
