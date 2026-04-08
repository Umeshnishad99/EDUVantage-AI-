/**
 * migrate_cgpa.js
 * Run once: node src/migrate_cgpa.js
 * Creates cgpa_recommendations, cgpa_roadmaps, and chat_history tables.
 */
require('dotenv').config();
const { query } = require('./config/db');

async function migrate() {
  console.log('🚀 Running CGPA migration...');

  await query(`
    CREATE TABLE IF NOT EXISTS cgpa_recommendations (
      id          SERIAL PRIMARY KEY,
      min_cgpa    NUMERIC(4,2) NOT NULL,
      max_cgpa    NUMERIC(4,2) NOT NULL,
      title       TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('✅  cgpa_recommendations table ready');

  await query(`
    CREATE TABLE IF NOT EXISTS cgpa_roadmaps (
      id          SERIAL PRIMARY KEY,
      min_cgpa    NUMERIC(4,2) NOT NULL,
      max_cgpa    NUMERIC(4,2) NOT NULL,
      title       TEXT NOT NULL,
      steps       JSONB NOT NULL DEFAULT '[]',
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('✅  cgpa_roadmaps table ready');

  await query(`
    CREATE TABLE IF NOT EXISTS chat_history (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
      role        TEXT NOT NULL CHECK (role IN ('user','model')),
      content     TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('✅  chat_history table ready');

  console.log('🎉 Migration complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
