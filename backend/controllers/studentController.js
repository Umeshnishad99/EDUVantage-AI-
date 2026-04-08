const { query } = require('../config/db');

// @desc  Get all students (teacher view — reads from users + performance)
// @route GET /api/students
const getStudents = async (req, res) => {
  try {
    // FIX #5 — predictions table has gpa & category, NOT predicted_gpa_4/predicted_gpa_10
    const result = await query(`
      SELECT u.id, u.name, u.email, u.created_at,
             pr.gpa, pr.category, pr.confidence_score
      FROM   users u
      LEFT JOIN LATERAL (
        SELECT p.gpa, p.category, p.confidence_score
        FROM   predictions p
        JOIN   student_performance sp ON p.performance_id = sp.id
        WHERE  sp.user_id = u.id
        ORDER  BY p.created_at DESC
        LIMIT  1
      ) pr ON true
      WHERE u.role = 'student'
      ORDER BY u.created_at DESC
    `);
    return res.json(result.rows);
  } catch (error) {
    console.error('❌ [getStudents]:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Create a student profile record (legacy)
// @route POST /api/students
const createStudent = async (req, res) => {
  const { first_name, last_name, age, gender } = req.body;
  try {
    const result = await query(
      'INSERT INTO students (user_id, first_name, last_name, age, gender) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [req.user.id, first_name, last_name, age, gender]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ [createStudent]:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Delete a student profile
// @route DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM students WHERE id=$1 AND user_id=$2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found or unauthorized' });
    }
    return res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('❌ [deleteStudent]:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Get one student profile + academic records (legacy)
// @route GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const studentResult = await query(
      `SELECT s.*, u.email, u.name 
       FROM users u 
       LEFT JOIN students s ON s.user_id = u.id 
       WHERE u.id=$1`,
      [req.params.id]
    );
    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const row = studentResult.rows[0];
    const first_name = row.first_name || row.name?.split(' ')[0] || 'Unknown';
    const last_name = row.last_name || row.name?.split(' ').slice(1).join(' ') || '';

    const [records, predictions] = await Promise.all([
      query('SELECT * FROM academic_records WHERE student_id=$1 ORDER BY created_at DESC', [row.id || -1]),
      query(`
        SELECT p.* FROM predictions p
        JOIN student_performance sp ON p.performance_id = sp.id
        WHERE sp.user_id = $1
        ORDER BY p.created_at DESC
      `, [req.params.id]),
    ]);

    return res.json({ ...row, first_name, last_name, id: req.params.id, records: records.rows, predictions: predictions.rows });
  } catch (error) {
    console.error('❌ [getStudentById]:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Add academic record + trigger ML prediction (legacy route)
// @route POST /api/students/:id/records
const addAcademicRecord = async (req, res) => {
  const { term, subjects, attendance_rate, study_hours_per_week } = req.body;
  const studentId = req.params.id;

  try {
    const studentResult = await query(
      'SELECT id, user_id FROM students WHERE id=$1 AND user_id=$2',
      [studentId, req.user.id]
    );
    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found or unauthorized' });
    }
    const studentUserId = studentResult.rows[0].user_id;

    const subjectValues = Object.values(subjects || {});
    const marks = Array.from({ length: 5 }, (_, i) => Number(subjectValues[i] || 0));
    const [marks1, marks2, marks3, marks4, marks5] = marks;

    const recordInsert = await query(
      `INSERT INTO academic_records
         (student_id, term, subjects, marks1, marks2, marks3, marks4, marks5,
          attendance_rate, study_hours_per_week)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
      [studentId, term, JSON.stringify(subjects), marks1, marks2, marks3, marks4, marks5,
       attendance_rate, study_hours_per_week]
    );
    const recordId = recordInsert.rows[0].id;

    // Call ML API to generate prediction
    const mlApiUrl = (process.env.ML_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');
    let predData = { gpa: 0, category: 'Unknown', confidence_score: 0, recommendations: '[]', roadmap: '[]' };

    try {
      const rawAtt   = Number(attendance_rate || 0.9);
      const attForML = rawAtt <= 1 ? rawAtt * 100 : rawAtt;

      const mlRes = await fetch(`${mlApiUrl}/predict`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          math: marks1, english: marks2, computer: marks3,
          physics: marks4, chemistry: marks5, biology: 0,
          attendance_rate: attForML,
          study_hours: Number(study_hours_per_week || 5),
          parent_support: 3, free_time: 3, go_out: 2,
          internet_access: 1, extracurricular: 0, part_time_job: 0, ses_quartile: 2,
        }),
      });

      if (mlRes.ok) {
        const ml     = await mlRes.json();
        predData.gpa = ml.predicted_gpa || 0;
        predData.category = ml.category || 'Unknown';
        predData.confidence_score = 0.95;
      } else {
        console.error('ML API Error:', await mlRes.text());
      }
    } catch (apiErr) {
      console.error('ML API connection failed:', apiErr.message);
    }

    // FIX #4 — predictions schema uses user_id + performance_id, NOT student_id + record_id.
    // Find or create a student_performance row linked to this student's user_id.
    let performanceId;
    try {
      const spRes = await query(
        `INSERT INTO student_performance
           (user_id, math, english, computer, physics, chemistry, biology,
            attendance, study_hours)
         VALUES ($1,$2,$3,$4,$5,$6,0,$7,$8) RETURNING id`,
        [studentUserId, marks1, marks2, marks3, marks4, marks5,
         Number(attendance_rate || 0.9), Number(study_hours_per_week || 5)]
      );
      performanceId = spRes.rows[0].id;
    } catch (spErr) {
      console.error('❌ student_performance insert (legacy):', spErr.message);
      return res.status(500).json({ message: 'Database Error', error: spErr.message });
    }

    const predInsert = await query(
      `INSERT INTO predictions
         (user_id, performance_id, predicted_score, gpa, category,
          confidence_score, recommendations, roadmap)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        studentUserId, performanceId,
        Math.round((predData.gpa / 10) * 100),
        predData.gpa, predData.category, predData.confidence_score,
        predData.recommendations, predData.roadmap,
      ]
    );

    return res.status(201).json({
      message:    'Record added and prediction generated',
      recordId,
      prediction: predInsert.rows[0],
    });

  } catch (error) {
    console.error('❌ [addAcademicRecord]:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Get logged-in student's own profile
// @route GET /api/students/me
const getLoggedInStudentProfile = async (req, res) => {
  try {
    const studentResult = await query(
      'SELECT * FROM students WHERE user_id=$1', [req.user.id]
    );
    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found. Please complete your registration.' });
    }

    const studentId = studentResult.rows[0].id;
    const [records, predictions] = await Promise.all([
      query('SELECT * FROM academic_records WHERE student_id=$1 ORDER BY created_at DESC', [studentId]),
      query(`
        SELECT p.* FROM predictions p
        JOIN student_performance sp ON p.performance_id = sp.id
        WHERE sp.user_id = $1
        ORDER BY p.created_at DESC
      `, [req.user.id]),
    ]);

    return res.json({ ...studentResult.rows[0], records: records.rows, predictions: predictions.rows });
  } catch (error) {
    console.error('❌ [getLoggedInStudentProfile]:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Dashboard statistics for teacher
// @route GET /api/students/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    // FIX #5 — rewritten to use actual schema (no predicted_gpa_10/student_id columns)
    const [totalRes, avgGpaRes, catRes, newStudRes, alertsRes, subAvgRes] = await Promise.all([
      query('SELECT COUNT(*) FROM users WHERE role=$1', ['student']),
      query('SELECT AVG(gpa) AS avg_gpa FROM predictions'),
      query('SELECT category, COUNT(*) AS cnt FROM predictions GROUP BY category'),
      query(`
        SELECT name, created_at FROM users
        WHERE role='student' AND created_at > NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC LIMIT 5
      `),
      query(`
        SELECT u.name, sp.attendance, p.gpa, p.category
        FROM   student_performance sp
        JOIN   users u ON sp.user_id = u.id
        JOIN   predictions p ON p.performance_id = sp.id
        WHERE  sp.attendance < 0.75 OR p.gpa < 5.0
        ORDER  BY sp.created_at DESC LIMIT 10
      `),
      query(`
        SELECT AVG(math) AS avg_math, AVG(english) AS avg_english,
               AVG(computer) AS avg_computer, AVG(physics) AS avg_physics,
               AVG(chemistry) AS avg_chemistry, AVG(biology) AS avg_biology
        FROM student_performance
      `),
    ]);

    const categoryCount = {};
    catRes.rows.forEach((r) => { categoryCount[r.category] = parseInt(r.cnt); });

    return res.json({
      totalStudents:        parseInt(totalRes.rows[0].count),
      avgPredictedGpa:      parseFloat(avgGpaRes.rows[0].avg_gpa || 0).toFixed(1),
      categoryDistribution: categoryCount,
      subjectAverages:      subAvgRes.rows[0],
      newStudents:          newStudRes.rows,
      alerts: alertsRes.rows.map((a) => ({
        student:  a.name,
        message:  a.attendance < 0.75
          ? `Attendance critical: ${(a.attendance * 100).toFixed(0)}%`
          : `Academic risk: GPA ${a.gpa}, Category: ${a.category}`,
        severity: (a.attendance < 0.60 || a.gpa < 4.0) ? 'high' : 'medium',
      })),
    });
  } catch (error) {
    console.error('❌ [getDashboardStats]:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStudents, createStudent, deleteStudent,
  getStudentById, addAcademicRecord,
  getLoggedInStudentProfile, getDashboardStats,
};
