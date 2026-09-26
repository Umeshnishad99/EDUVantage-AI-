const express = require('express');
const router  = express.Router();
// FIX #7 — use corrected export name (was predictSTudentPerformance)
const { predictStudentPerformance } = require('../controllers/predictionController');

// POST /api/predict
router.post('/', predictStudentPerformance);

module.exports = router;
