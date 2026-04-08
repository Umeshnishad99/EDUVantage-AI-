const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  adminListRecs, adminCreateRec, adminUpdateRec, adminDeleteRec, getRecByCgpa,
  adminListRoadmaps, adminCreateRoadmap, adminUpdateRoadmap, adminDeleteRoadmap, getRoadmapByCgpa,
} = require('../controllers/cgpaController');

const router = express.Router();

// ── Student routes (any authenticated user) ──────────────────────────────
router.get('/recommendation/:cgpa', protect, getRecByCgpa);
router.get('/roadmap/:cgpa',        protect, getRoadmapByCgpa);

// ── Admin / Teacher routes ───────────────────────────────────────────────
router.get('/admin/recommendations',       protect, adminListRecs);
router.post('/admin/recommendation',       protect, adminCreateRec);
router.put('/admin/recommendation/:id',    protect, adminUpdateRec);
router.delete('/admin/recommendation/:id', protect, adminDeleteRec);

router.get('/admin/roadmaps',       protect, adminListRoadmaps);
router.post('/admin/roadmap',       protect, adminCreateRoadmap);
router.put('/admin/roadmap/:id',    protect, adminUpdateRoadmap);
router.delete('/admin/roadmap/:id', protect, adminDeleteRoadmap);

module.exports = router;
