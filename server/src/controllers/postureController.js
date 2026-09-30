const { Posture, isConnected, memoryStore } = require('../config/db');
const aiService = require('../services/aiService');

exports.getPosture = async (req, res) => {
  try {
    if (isConnected()) {
      let posture = await Posture.findOne().sort({ createdAt: -1 });
      if (!posture) {
        posture = await Posture.create(memoryStore.postureState);
      }
      return res.status(200).json({ success: true, data: posture });
    } else {
      return res.status(200).json({ success: true, data: memoryStore.postureState });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePosture = async (req, res) => {
  try {
    const answers = req.body;
    const evaluation = await aiService.evaluatePosture(answers);

    const updateData = {
      ...answers,
      score: evaluation.overall_score,
      grade: evaluation.grade,
      status: evaluation.status,
      nist_alignment: evaluation.nist_alignment,
      checklist: evaluation.checklist,
      last_updated: new Date()
    };

    if (isConnected()) {
      let posture = await Posture.findOne().sort({ createdAt: -1 });
      if (posture) {
        Object.assign(posture, updateData);
        await posture.save();
      } else {
        posture = await Posture.create(updateData);
      }
      return res.status(200).json({
        success: true,
        message: 'Security posture updated successfully in MongoDB',
        data: posture
      });
    } else {
      memoryStore.postureState = {
        ...memoryStore.postureState,
        ...updateData,
        last_updated: new Date().toISOString()
      };
      return res.status(200).json({
        success: true,
        message: 'Security posture updated successfully',
        data: memoryStore.postureState
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
