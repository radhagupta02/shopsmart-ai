import { get, post } from './client.js';

/**
 * GET /documents
 * Lists approved knowledge base documents with statuses and chunk counts.
 * @returns {Promise<Array<{
 *   id: string,
 *   title: string,
 *   version: string,
 *   effectiveDate: string,
 *   category: string,
 *   region: string,
 *   fileType: string,
 *   status: 'PROCESSING'|'READY'|'FAILED',
 *   chunkCount: number,
 *   createdAt: string
 * }>>}
 */
export function listDocuments() {
  return get('/documents');
}

/**
 * POST /documents
 * Uploads a document for ingestion (multipart/form-data or JSON payload).
 * @param {FormData|Object} formData
 * @returns {Promise<{id: string, status: 'PROCESSING'}>}
 */
export function uploadDocument(formData) {
  return post('/documents', formData);
}
