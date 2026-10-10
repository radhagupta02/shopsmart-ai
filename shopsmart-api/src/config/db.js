import pg from 'pg';
import pgvector from 'pgvector/pg';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  onConnect: async (client) => {
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
      await pgvector.registerTypes(client);
    } catch (err) {
      logger.warn('Could not register vector extension or types', err);
    }
  }
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);

export const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};
