const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user:     process.env.DB_USER,
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:     process.env.DB_PORT,
});

async function runFix() {
  try {
    const schemaPath = path.join(__dirname, 'config', 'schema.sql');
    console.log('Reading schema from:', schemaPath);
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying fresh schema to database...');
    await pool.query(sql);
    console.log('✅ DATABASE SCHEMA UPDATED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ FAILED TO UPDATE SCHEMA:', err.message);
    process.exit(1);
  }
}

runFix();
