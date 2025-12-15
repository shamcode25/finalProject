import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// URL-encode password if it contains special characters
let connectionString = process.env.DATABASE_URL || process.env.POSTGRESQL_URI;
if (connectionString && connectionString.includes('@') && !connectionString.includes('%40')) {
  // If password contains @, we need to URL-encode it
  const match = connectionString.match(/postgresql:\/\/postgres:([^@]+)@/);
  if (match && match[1].includes('@')) {
    const encodedPassword = encodeURIComponent(match[1]);
    connectionString = connectionString.replace(/postgres:([^@]+)@/, `postgres:${encodedPassword}@`);
  }
}

// Check if this is a Supabase connection (requires SSL)
const isSupabase = connectionString && connectionString.includes('supabase.co');

const pool = new Pool({
  connectionString: connectionString,
  ssl: isSupabase || process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

// Initialize database schema
export async function initializeDatabase() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('confused', 'too-fast', 'too-slow', 'great', 'question', 'other')),
        session_id VARCHAR(255) DEFAULT 'default-session',
        sentiment VARCHAR(50) DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'negative', 'neutral')),
        ai_classification VARCHAR(255) DEFAULT '',
        confidence DECIMAL(3, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_feedbacks_session_id ON feedbacks(session_id);
      CREATE INDEX IF NOT EXISTS idx_feedbacks_type ON feedbacks(type);
      CREATE INDEX IF NOT EXISTS idx_feedbacks_sentiment ON feedbacks(sentiment);
      CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at);
    `;

    await pool.query(createTableQuery);
    console.log('✅ Database schema initialized');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

export default pool;

