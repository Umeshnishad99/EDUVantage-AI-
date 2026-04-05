const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Global Request Logger ──────────────────────────────
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Payload:`, JSON.stringify(req.body, null, 2));
  }
  next();
});

app.get('/', (req, res) => res.send('Student Performance AI API v2 running'));

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',           require('./routes/authRoutes'));
app.use('/api/performance',    require('./routes/performanceRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/predict',         require('./routes/predictionRoutes'));
app.use('/api/students',       require('./routes/studentRoutes'));  // legacy
app.use('/api/cgpa',           require('./routes/cgpaRoutes'));
app.use('/api/chat',           require('./routes/chatRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
