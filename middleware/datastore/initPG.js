import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// PG Declarations
const {
  Pool,
} = pg;
const pgConnectionConfigs = {
  user: process.env.USER,
  host: '127.0.0.1',
  database: process.env.DATABASE,
  port: 5432, // Postgres server always runs on this port by default
};
const pool = new Pool(pgConnectionConfigs);
export default pool;