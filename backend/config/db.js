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
    console.error('❌ DB Test Connection Failed!');
    console.error('   Error Code:', err.code);
    console.error('   Error Message:', err.message);
    console.error('   DATABASE_URL status:', connectionString ? 'PRESENT' : 'MISSING');
  } else {
    // Log connection details (safely)
    const dbInfo = connectionString ? 'Remote (Neon)' : `${process.env.DB_NAME} on ${process.env.DB_HOST}`;
    console.log(`✅ DB Connected: ${dbInfo}`);
    console.log('✅ Server Time:', res.rows[0].now);
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
