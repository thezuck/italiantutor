import pg from 'pg';
import env from '../config/env.js';

const { Client } = pg;

// Connect to PostgreSQL server (not a specific database)
const client = new Client({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});

async function createDatabase() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL server');

    // Check if database exists
    const checkDb = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [env.DB_NAME]
    );

    if (checkDb.rows.length > 0) {
      console.log(`✅ Database "${env.DB_NAME}" already exists`);
    } else {
      // Create database
      await client.query(`CREATE DATABASE ${env.DB_NAME}`);
      console.log(`✅ Database "${env.DB_NAME}" created successfully`);
    }
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();

