import pg from 'pg';
// PG Declarations
const {
  Pool,
} = pg;
const pgConnectionConfigs = {
  user: 'tehkohrz',
  host: '127.0.0.1',
  database: 'nerdTest',
  port: 5432, // Postgres server always runs on this port by default
};
const pool = new Pool(pgConnectionConfigs);
export default pool;