const express = require('express');
const {
  getStudents,
  createStudent,
  deleteStudent,
  getStudentById,
  addAcademicRecord,
  getLoggedInStudentProfile,
  getDashboardStats,
} = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me',              protect, getLoggedInStudentProfile);
router.get('/dashboard/stats', protect, getDashboardStats);

router.route('/')
  .get(protect,  getStudents)
  .post(protect, createStudent);

router.route('/:id')
  .get(protect,    getStudentById)
  .delete(protect, deleteStudent);

router.route('/:id/records')
  .post(protect, addAcademicRecord);

module.exports = router;
