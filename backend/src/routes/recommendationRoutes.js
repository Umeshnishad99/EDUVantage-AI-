const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  getRecommendations, createRecommendation, updateRecommendation, deleteRecommendation
} = require('../controllers/recommendationController');

const router = express.Router();

router.get('/',      protect, getRecommendations);
router.post('/',     protect, createRecommendation);
router.put('/:id',   protect, updateRecommendation);
router.delete('/:id',protect, deleteRecommendation);

module.exports = router;
