const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/executive', reportController.generateExecutiveReport);

module.exports = router;
