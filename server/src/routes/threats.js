const express = require('express');
const router = express.Router();
const threatController = require('../controllers/threatController');

router.get('/incidents', threatController.getIncidents);
router.post('/remediate', threatController.executeRemediation);
router.post('/translate-bluf', threatController.translateTechnicalThreat);

module.exports = router;
