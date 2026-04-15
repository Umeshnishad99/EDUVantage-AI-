const { query } = require('./config/db');

async function migrateReset() {
  try {
    console.log('Adding reset token columns to users table...');
    
    // Add reset_token column
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
    `);
    
    // Add reset_token_expiry column
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;
    `);
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrateReset();
