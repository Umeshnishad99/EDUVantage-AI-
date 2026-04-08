const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL if available (for Neon/Production), otherwise use individual variables
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  user: !connectionString ? process.env.DB_USER : undefined,
  host: !connectionString ? process.env.DB_HOST : undefined,
  database: !connectionString ? process.env.DB_NAME : undefined,
  password: !connectionString ? process.env.DB_PASSWORD : undefined,
  port: !connectionString ? process.env.DB_PORT : undefined,
  ssl: connectionString ? { rejectUnauthorized: false } : false
});

// Diagnostic check (Safe to run without top-level await)
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ DB Test Connection Failed:', err.message);
  } else {
    console.log('✅ DB Connected. Server Time:', res.rows[0].now);
  }
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
