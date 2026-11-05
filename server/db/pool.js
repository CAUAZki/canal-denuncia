import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://canal:canal_dev_local@localhost:5432/canal_seguro',
  max: 10,
});
