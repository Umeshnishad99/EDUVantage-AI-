const express  = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  submitPerformance, getMyPerformance, getAllPerformance, getDashboardStats
} = require('../controllers/performanceController');

const router = express.Router();

router.post('/',        protect, submitPerformance);
router.get('/me',       protect, getMyPerformance);
router.get('/all',      protect, getAllPerformance);
router.get('/stats',    protect, getDashboardStats);

module.exports = router;
