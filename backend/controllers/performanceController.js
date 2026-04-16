const { query } = require('../config/db');

// Verify DB schema at startup (Auto-initialize if missing)
const verifySchema = async () => {
  try {
    const checkRes = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'student_performance'
    `);

    if (checkRes.rows.length === 0) {
      console.log('⚠️  Schema missing. Attempting auto-setup...');
      const fs = require('fs');
      const path = require('path');
      const schemaPath = path.join(__dirname, '../config/schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      await query(schemaSql);
      console.log('✅ Auto-setup complete: Tables created.');
    } else {
      console.log('📊 DB SCHEMA (student_performance): ✅ FOUND');
    }
  } catch (err) {
    console.error('❌ SCHEMA VERIFICATION / AUTO-SETUP FAILED!');
    console.error('   Error Message:', err.message);
  }
};
verifySchema();

// ── Helper ────────────────────────────────────────────────────────────
const safeNum = (val, def = 0) => {
  const num = Number(val);
  return isNaN(num) ? def : num;
};

// @desc  Submit student performance → call ML → save prediction
// @route POST /api/performance
// @access Private (student)
const submitPerformance = async (req, res) => {
  const {
    age, ses_quartile, parental_education, school_type,
    math, english, computer, physics, chemistry, biology,
    attendance, study_hours,
    internet_access, extracurricular, part_time_job,
    parent_support, free_time, go_out,
  } = req.body;

  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    console.log('🚀 SUBMIT for user:', req.user.id);

    // ── STEP 1: Insert student_performance record ────────────────
    const perfParams = [
      req.user.id, age, ses_quartile, parental_education, school_type,
      math, english, computer, physics, chemistry, biology,
      attendance, study_hours, internet_access, extracurricular,
      part_time_job, parent_support, free_time, go_out
    ];

    const perfResult = await query(
      `INSERT INTO student_performance
         (user_id, age, ses_quartile, parental_education, school_type,
          math, english, computer, physics, chemistry, biology,
          attendance, study_hours, internet_access, extracurricular,
          part_time_job, parent_support, free_time, go_out)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
       RETURNING id`,
      perfParams
    );
    const performanceId = perfResult.rows[0].id;

    let mlApiUrl = (process.env.ML_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');
    let pred = {
      predicted_score: 0, 
      gpa: 0, 
      category: 'Unknown',
      weak_areas: [],
      recommendations: '',
      roadmap: [],
      confidence_score: 0.95
    };

    try {
      const mlBody = {
        math, english, computer, physics, chemistry, biology,
        attendance_rate: attendance * 100,
        study_hours, parent_support, free_time, go_out,
        internet_access, extracurricular, part_time_job, ses_quartile
      };

      const mlRes = await fetch(`${mlApiUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mlBody),
      });

      if (mlRes.ok) {
        const mlData = await mlRes.json();
        pred.gpa             = mlData.predicted_gpa || 0;
        pred.category        = mlData.category      || 'Unknown';
        pred.predicted_score = Math.round((pred.gpa / 10) * 100);
        pred.weak_areas      = mlData.weak_areas    || [];
        pred.recommendations = mlData.recommendations || '';
        pred.roadmap         = mlData.roadmap       || [];
      }
    } catch (mlErr) {
      console.error('ML API Connection Failed:', mlErr.message);
    }

    const predParams = [
      req.user.id, performanceId, pred.predicted_score, pred.gpa, pred.category,
      pred.confidence_score, JSON.stringify(pred.recommendations),
      JSON.stringify(pred.roadmap), JSON.stringify(pred.weak_areas)
    ];

    const predResult = await query(
      `INSERT INTO predictions
         (user_id, performance_id, predicted_score, gpa, category,
          confidence_score, recommendations, roadmap, weak_areas)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      predParams
    );

    return res.status(201).json({
      message: 'Analysis complete',
      performance_id: performanceId,
      prediction: predResult.rows[0],
    });

  } catch (criticalErr) {
    console.error('Error [submitPerformance]:', criticalErr);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

};

// @desc  Get logged-in student's latest performance + prediction
// @route GET /api/performance/me
const getMyPerformance = async (req, res) => {
  try {
    const perfRes = await query(
      'SELECT * FROM student_performance WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );
    if (perfRes.rows.length === 0) {
      return res.status(404).json({ message: 'No submission found' });
    }
    const perf = perfRes.rows[0];

    const predRes = await query(
      'SELECT * FROM predictions WHERE performance_id = $1 ORDER BY created_at DESC LIMIT 1',
      [perf.id]
    );

    return res.json({ performance: perf, prediction: predRes.rows[0] || null });
  } catch (error) {
    console.error('❌ ERROR [getMyPerformance]:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Get all students' performance (teacher)
// @route GET /api/performance/all
const getAllPerformance = async (req, res) => {
  try {
    const result = await query(`
      SELECT sp.*, u.name, u.email,
             pr.predicted_score, pr.gpa, pr.category, pr.confidence_score,
             pr.recommendations, pr.roadmap, pr.created_at AS predicted_at
      FROM   student_performance sp
      JOIN   users u ON sp.user_id = u.id
      LEFT JOIN LATERAL (
        SELECT * FROM predictions WHERE performance_id = sp.id
        ORDER BY created_at DESC LIMIT 1
      ) pr ON true
      ORDER BY sp.created_at DESC
    `);
    return res.json(result.rows);
  } catch (error) {
    console.error('❌ ERROR [getAllPerformance]:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Dashboard stats (teacher)
// @route GET /api/performance/stats
const getDashboardStats = async (req, res) => {
  try {
    const [total, avgGpa, catDist, recent, alerts] = await Promise.all([
      query('SELECT COUNT(*) FROM student_performance'),
      query('SELECT AVG(gpa) FROM predictions'),
      query('SELECT category, COUNT(*) AS cnt FROM predictions GROUP BY category'),
      query(`
        SELECT u.name, sp.created_at, pr.gpa, pr.category
        FROM   student_performance sp
        JOIN   users u  ON sp.user_id = u.id
        LEFT JOIN predictions pr ON pr.performance_id = sp.id
        ORDER BY sp.created_at DESC LIMIT 5
      `),
      query(`
        SELECT u.name, sp.attendance, pr.gpa, pr.category
        FROM   student_performance sp
        JOIN   users u  ON sp.user_id = u.id
        JOIN   predictions pr ON pr.performance_id = sp.id
        WHERE  sp.attendance < 0.75 OR pr.gpa < 5
        ORDER BY sp.created_at DESC LIMIT 10
      `),
    ]);

    const dist = {};
    catDist.rows.forEach((r) => { dist[r.category] = parseInt(r.cnt); });

    return res.json({
      totalStudents:        parseInt(total.rows[0].count),
      avgGpa:               parseFloat(avgGpa.rows[0].avg || 0).toFixed(1),
      categoryDistribution: dist,
      recentStudents:       recent.rows,
      alerts: alerts.rows.map((a) => ({
        name:     a.name,
        message:  a.attendance < 0.75
          ? `Attendance critical: ${(a.attendance * 100).toFixed(0)}%`
          : `Low GPA: ${a.gpa} (${a.category})`,
        severity: (a.attendance < 0.60 || a.gpa < 4) ? 'high' : 'medium',
      })),
    });
  } catch (error) {
    console.error('❌ ERROR [getDashboardStats]:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { submitPerformance, getMyPerformance, getAllPerformance, getDashboardStats };
