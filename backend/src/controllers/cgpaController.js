const { query } = require('../config/db');

// ─── ADMIN: List all CGPA recommendations ──────────────────────────────────
const adminListRecs = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM cgpa_recommendations ORDER BY min_cgpa ASC, created_at DESC'
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── ADMIN: Create CGPA recommendation ────────────────────────────────────
const adminCreateRec = async (req, res) => {
  const { min_cgpa, max_cgpa, title, description } = req.body;
  if (min_cgpa == null || max_cgpa == null || !title || !description) {
    return res.status(400).json({ message: 'min_cgpa, max_cgpa, title and description are required' });
  }
  try {
    const result = await query(
      'INSERT INTO cgpa_recommendations (min_cgpa, max_cgpa, title, description) VALUES ($1,$2,$3,$4) RETURNING *',
      [min_cgpa, max_cgpa, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── ADMIN: Update CGPA recommendation ────────────────────────────────────
const adminUpdateRec = async (req, res) => {
  const { min_cgpa, max_cgpa, title, description } = req.body;
  try {
    const result = await query(
      `UPDATE cgpa_recommendations
       SET min_cgpa=$1, max_cgpa=$2, title=$3, description=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [min_cgpa, max_cgpa, title, description, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── ADMIN: Delete CGPA recommendation ────────────────────────────────────
const adminDeleteRec = async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM cgpa_recommendations WHERE id=$1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── STUDENT: Get recommendation by CGPA ──────────────────────────────────
const getRecByCgpa = async (req, res) => {
  const cgpa = parseFloat(req.params.cgpa);
  if (isNaN(cgpa)) return res.status(400).json({ message: 'Invalid CGPA' });
  try {
    const result = await query(
      'SELECT * FROM cgpa_recommendations WHERE $1 BETWEEN min_cgpa AND max_cgpa ORDER BY created_at DESC',
      [cgpa]
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── ADMIN: List all CGPA roadmaps ────────────────────────────────────────
const adminListRoadmaps = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM cgpa_roadmaps ORDER BY min_cgpa ASC, created_at DESC'
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── ADMIN: Create CGPA roadmap ───────────────────────────────────────────
const adminCreateRoadmap = async (req, res) => {
  const { min_cgpa, max_cgpa, title, steps } = req.body;
  if (min_cgpa == null || max_cgpa == null || !title) {
    return res.status(400).json({ message: 'min_cgpa, max_cgpa and title are required' });
  }
  try {
    const result = await query(
      'INSERT INTO cgpa_roadmaps (min_cgpa, max_cgpa, title, steps) VALUES ($1,$2,$3,$4) RETURNING *',
      [min_cgpa, max_cgpa, title, JSON.stringify(steps || [])]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── ADMIN: Update CGPA roadmap ───────────────────────────────────────────
const adminUpdateRoadmap = async (req, res) => {
  const { min_cgpa, max_cgpa, title, steps } = req.body;
  try {
    const result = await query(
      `UPDATE cgpa_roadmaps
       SET min_cgpa=$1, max_cgpa=$2, title=$3, steps=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [min_cgpa, max_cgpa, title, JSON.stringify(steps || []), req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── ADMIN: Delete CGPA roadmap ───────────────────────────────────────────
const adminDeleteRoadmap = async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM cgpa_roadmaps WHERE id=$1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── STUDENT: Get roadmap by CGPA ─────────────────────────────────────────
const getRoadmapByCgpa = async (req, res) => {
  const cgpa = parseFloat(req.params.cgpa);
  if (isNaN(cgpa)) return res.status(400).json({ message: 'Invalid CGPA' });
  try {
    const result = await query(
      'SELECT * FROM cgpa_roadmaps WHERE $1 BETWEEN min_cgpa AND max_cgpa ORDER BY created_at DESC',
      [cgpa]
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  adminListRecs, adminCreateRec, adminUpdateRec, adminDeleteRec, getRecByCgpa,
  adminListRoadmaps, adminCreateRoadmap, adminUpdateRoadmap, adminDeleteRoadmap, getRoadmapByCgpa,
};
