const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

const setupDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running database setup... Make sure you created the database in PostgreSQL first.');
    await pool.query(schemaSql);
    console.log('Database tables created successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up the database:', error);
    process.exit(-1);
  }
};

setupDatabase();
