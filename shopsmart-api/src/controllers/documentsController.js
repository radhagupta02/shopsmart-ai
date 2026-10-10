import { query } from '../config/db.js';
import { processDocumentBackground } from '../services/ingestion/ingestService.js';
import { AppError } from '../utils/AppError.js';
import path from 'path';

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const { version, effectiveDate, category, region, title } = req.body;
    
    if (req.file.size > 10 * 1024 * 1024) {
      throw new AppError('File too large', 413);
    }

    const originalName = req.file.originalname;
    const ext = path.extname(originalName).toLowerCase();
    
    let fileType;
    if (ext === '.md') fileType = 'MD';
    else if (ext === '.json') fileType = 'JSON';
    else if (ext === '.pdf') {
      const magic = req.file.buffer.toString('hex', 0, 4);
      if (magic !== '25504446') { // %PDF
        throw new AppError('Invalid PDF file', 415);
      }
      fileType = 'PDF';
    } else {
      throw new AppError('Unsupported file type', 415);
    }

    const docTitle = title || path.basename(originalName, ext);

    const result = await query(
      `INSERT INTO documents (title, version, effective_date, category, region, file_type, status, chunk_count, uploaded_by) 
       VALUES ($1, $2, $3, $4, $5, $6, 'PROCESSING', 0, $7) RETURNING id`,
      [docTitle, version, effectiveDate, category, region, fileType, req.user.id]
    );

    const docId = result.rows[0].id;

    // Fire and forget
    processDocumentBackground(docId, req.file.buffer, fileType, docTitle);

    res.status(201).json({ id: docId, status: 'PROCESSING' });
  } catch (err) {
    next(err);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const result = await query('SELECT id, title, version, effective_date as "effectiveDate", category, region, file_type as "fileType", status, chunk_count as "chunkCount", created_at as "createdAt" FROM documents ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
