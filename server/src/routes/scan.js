const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

router.post('/url', scanController.scanUrl);
router.post('/qr', scanController.scanQR);
router.post('/network-logs', scanController.scanNetworkLogs);
router.post('/email', scanController.scanEmailText);
router.get('/history', scanController.getScanHistory);

module.exports = router;
