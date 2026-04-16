const { Pool } = require('pg');
require('dotenv').config();

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

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ DB connection failed:', err.message);
  } else {
    console.log(`✅ DB Connected: ${connectionString ? 'Remote (Neon)' : 'Local'}`);
  }
});

pool.on('error', (err) => {
  console.error('❌ Database error:', err);
});


module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
