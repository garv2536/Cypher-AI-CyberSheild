const express = require('express');
const router = express.Router();
const postureController = require('../controllers/postureController');

router.get('/', postureController.getPosture);
router.post('/update', postureController.updatePosture);

module.exports = router;
