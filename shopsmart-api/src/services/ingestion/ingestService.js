import { query, transaction } from '../../config/db.js';
import { parseMarkdown } from './parseMarkdown.js';
import { parseJson } from './parseJson.js';
import { parsePdf } from './parsePdf.js';
import { chunkDocument } from './chunker.js';
import { embed } from '../ai/aiClient.js';
import { logger } from '../../utils/logger.js';
import pgvector from 'pgvector/pg';

export const processDocumentBackground = async (docId, fileBuffer, fileType, title) => {
  try {
    let sections;
    if (fileType === 'MD') {
      sections = parseMarkdown(fileBuffer.toString('utf-8'));
    } else if (fileType === 'JSON') {
      sections = parseJson(fileBuffer.toString('utf-8'));
    } else if (fileType === 'PDF') {
      sections = await parsePdf(fileBuffer);
    } else {
      throw new Error('Unsupported file type');
    }

    const chunks = chunkDocument(sections, title);
    
    const BATCH_SIZE = 5;
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const texts = batch.map(c => c.embeddingInput);
      const embeddings = await embed(texts, 'RETRIEVAL_DOCUMENT');
      
      batch.forEach((c, idx) => {
        c.embedding = embeddings[idx];
      });
    }

    await transaction(async (client) => {
      await client.query('DELETE FROM document_chunks WHERE document_id = $1', [docId]);
      for (const chunk of chunks) {
        const vectorStr = pgvector.toSql(chunk.embedding);
        await client.query(
          'INSERT INTO document_chunks (document_id, section, chunk_index, content, embedding) VALUES ($1, $2, $3, $4, $5)',
          [docId, chunk.section, chunk.chunk_index, chunk.content, vectorStr]
        );
      }
      await client.query(
        'UPDATE documents SET status = $1, chunk_count = $2 WHERE id = $3',
        ['READY', chunks.length, docId]
      );
    });
    logger.info(`Successfully ingested document ${docId} with ${chunks.length} chunks`);
  } catch (err) {
    logger.error(`Document processing failed for ${docId}: ${err.message}`);
    await query("UPDATE documents SET status = 'FAILED' WHERE id = $1", [docId]);
  }
};
