import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../src/config/db.js';
import { processDocumentBackground } from '../src/services/ingestion/ingestService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedFiles = [
  {
    file: "laptop-return-policy.md",
    title: "Laptop Return Policy",
    category: "Electronics",
    version: "2026.1",
    effectiveDate: "2026-01-01",
    region: "GLOBAL",
    fileType: "MD"
  },
  {
    file: "shipping-policy.md",
    title: "Shipping Policy",
    category: "General",
    version: "2026.2",
    effectiveDate: "2026-01-15",
    region: "GLOBAL",
    fileType: "MD"
  },
  {
    file: "refund-policy.md",
    title: "Refund Policy",
    category: "General",
    version: "2026.1",
    effectiveDate: "2026-01-01",
    region: "GLOBAL",
    fileType: "MD"
  },
  {
    file: "warranty-and-membership.json",
    title: "Warranty and Membership Benefits",
    category: "General",
    version: "2026.1",
    effectiveDate: "2026-01-01",
    region: "GLOBAL",
    fileType: "JSON"
  }
];

const run = async () => {
  try {
    const adminQuery = await query("SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1");
    if (adminQuery.rows.length === 0) {
      console.log('No admin user found to associate documents with. Please seed users first.');
      process.exit(1);
    }
    const adminId = adminQuery.rows[0].id;

    for (const doc of seedFiles) {
      console.log(`Checking if ${doc.title} exists...`);
      const existCheck = await query('SELECT id FROM documents WHERE title = $1', [doc.title]);
      if (existCheck.rows.length > 0) {
        console.log(`Skipping ${doc.title} (already exists).`);
        continue;
      }

      const filePath = path.join(__dirname, '../docs/sample-documents', doc.file);
      const fileBuffer = fs.readFileSync(filePath);

      console.log(`Inserting ${doc.title}...`);
      const result = await query(
        `INSERT INTO documents (title, version, effective_date, category, region, file_type, status, chunk_count, uploaded_by) 
         VALUES ($1, $2, $3, $4, $5, $6, 'PROCESSING', 0, $7) RETURNING id`,
        [doc.title, doc.version, doc.effectiveDate, doc.category, doc.region, doc.fileType, adminId]
      );

      const docId = result.rows[0].id;
      console.log(`Ingesting ${doc.title} (ID: ${docId})...`);
      await processDocumentBackground(docId, fileBuffer, doc.fileType, doc.title);
      console.log(`Finished ${doc.title}.`);
    }
    console.log('Seed completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

run();
