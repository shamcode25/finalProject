import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const connectionString = process.env.DATABASE_URL;

console.log('Testing connection to:', connectionString.replace(/:[^:@]+@/, ':****@'));

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('✅ Successfully connected to PostgreSQL!');
    return client.query('SELECT NOW()');
  })
  .then((result) => {
    console.log('✅ Database query successful!');
    console.log('Current time:', result.rows[0].now);
    return client.query('SELECT version()');
  })
  .then((result) => {
    console.log('✅ PostgreSQL version:', result.rows[0].version.split(',')[0]);
    client.end();
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection error:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 DNS resolution failed. Possible solutions:');
      console.error('1. Wait a few minutes for DNS propagation');
      console.error('2. Use connection pooler instead (port 6543)');
      console.error('3. Check if project is fully initialized');
    }
    process.exit(1);
  });

