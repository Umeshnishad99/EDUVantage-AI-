const express  = require('express');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middlewares/authMiddleware');
const { validatePerformance } = require('../middlewares/validationMiddleware');
const {
  submitPerformance, getMyPerformance, getAllPerformance, getDashboardStats
} = require('../controllers/performanceController');

const router = express.Router();

// Rate limiting for submissions: Max 10 requests per hour per IP/User
const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: 'Too many submissions. Please try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', protect, submissionLimiter, validatePerformance, submitPerformance);
router.get('/me',       protect, getMyPerformance);
router.get('/all',      protect, getAllPerformance);
router.get('/stats',    protect, getDashboardStats);

module.exports = router;
