import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../src/config/env.js';
import { query } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
  if (!env.EMBEDDING_DIM) {
    console.error('EMBEDDING_DIM is not defined in the environment.');
    process.exit(1);
  }

  const schemaPath = path.join(__dirname, '../db/schema.sql');
  const seedPath = path.join(__dirname, '../db/seed.sql');

  let schemaSql = fs.readFileSync(schemaPath, 'utf8');
  schemaSql = schemaSql.replace(/{{EMBEDDING_DIM}}/g, env.EMBEDDING_DIM);

  try {
    console.log('Dropping existing schema (if any)...');
    await query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');

    console.log('Running schema.sql...');
    await query(schemaSql);

    if (fs.existsSync(seedPath)) {
      console.log('Running seed.sql...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await query(seedSql);
    } else {
      console.log('No seed.sql found, skipping seed.');
    }

    console.log('Database initialization complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

initDb();
