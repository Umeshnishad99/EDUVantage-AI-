const { query } = require('../config/db');

// @desc  Get all custom recommendations (teacher can add)
// @route GET /api/recommendations
const getRecommendations = async (req, res) => {
  try {
    const result = await query(
      'SELECT cr.*, u.name as teacher_name FROM custom_recommendations cr JOIN users u ON cr.teacher_id = u.id ORDER BY cr.created_at DESC'
    );
    res.json(result.rows);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
};

// @desc  Create recommendation
// @route POST /api/recommendations
const createRecommendation = async (req, res) => {
  const { target_category, title, content } = req.body;
  try {
    const result = await query(
      'INSERT INTO custom_recommendations (teacher_id, target_category, title, content) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.id, target_category, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
};

// @desc  Update recommendation
// @route PUT /api/recommendations/:id
const updateRecommendation = async (req, res) => {
  const { target_category, title, content } = req.body;
  try {
    const result = await query(
      'UPDATE custom_recommendations SET target_category=$1, title=$2, content=$3, updated_at=NOW() WHERE id=$4 AND teacher_id=$5 RETURNING *',
      [target_category, title, content, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
};

// @desc  Delete recommendation
// @route DELETE /api/recommendations/:id
const deleteRecommendation = async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM custom_recommendations WHERE id=$1 AND teacher_id=$2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getRecommendations, createRecommendation, updateRecommendation, deleteRecommendation };
