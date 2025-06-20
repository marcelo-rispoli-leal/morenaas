//imports dependencies
import pg from 'pg';
//creates database connection
const db = {};

db.pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 3000,
});

export { db };
