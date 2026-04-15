const express = require('express');
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const cors    = require('cors');
require('dotenv').config();
const { query } = require('./config/db');

// ── Auto-Migration Logic for Production ──
async function bootstrapDB() {
  try {
    console.log('🔄 Checking Database Schema...');
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;
    `);
    console.log('✅ Database Schema is up to date.');
  } catch (err) {
    console.error('❌ Database Bootstrap Failed:', err.message);
  }
}
bootstrapDB();


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

app.get('/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: err.message });
  }
});


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
