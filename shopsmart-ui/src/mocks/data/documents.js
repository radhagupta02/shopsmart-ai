/**
 * Mock documents dataset per CONTRACT Section 45, 61-66.
 * Contains policies in READY, PROCESSING, and FAILED states.
 * Supports auto-transitioning PROCESSING documents to READY after polling.
 */

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-001',
    title: 'Laptop Return Policy',
    version: 'v2026.1',
    effectiveDate: '2026-01-15',
    category: 'Electronics',
    region: 'GLOBAL',
    fileType: 'MD',
    status: 'READY',
    chunkCount: 6,
    createdAt: '2026-01-15T09:00:00Z',
    pollCount: 0,
  },
  {
    id: 'doc-002',
    title: 'Refund Policy',
    version: 'v2026.1',
    effectiveDate: '2026-01-10',
    category: 'Policies',
    region: 'GLOBAL',
    fileType: 'MD',
    status: 'READY',
    chunkCount: 4,
    createdAt: '2026-01-10T10:00:00Z',
    pollCount: 0,
  },
  {
    id: 'doc-003',
    title: 'Shipping Policy',
    version: 'v2026.2',
    effectiveDate: '2026-02-01',
    category: 'Shipping',
    region: 'GLOBAL',
    fileType: 'MD',
    status: 'READY',
    chunkCount: 5,
    createdAt: '2026-02-01T11:00:00Z',
    pollCount: 0,
  },
  {
    id: 'doc-004',
    title: 'Warranty and Membership Benefits',
    version: 'v2026.1',
    effectiveDate: '2026-01-05',
    category: 'Warranty',
    region: 'GLOBAL',
    fileType: 'JSON',
    status: 'READY',
    chunkCount: 8,
    createdAt: '2026-01-05T12:00:00Z',
    pollCount: 0,
  },
  {
    id: 'doc-005',
    title: 'EU Compliance Addendum',
    version: 'v2026.0',
    effectiveDate: '2026-03-01',
    category: 'Legal',
    region: 'EU',
    fileType: 'PDF',
    status: 'FAILED',
    chunkCount: 0,
    createdAt: '2026-03-01T08:30:00Z',
    pollCount: 0,
  },
  {
    id: 'doc-006',
    title: 'Recent Upload Test',
    version: 'v2026.1',
    effectiveDate: '2026-10-10',
    category: 'General',
    region: 'GLOBAL',
    fileType: 'PDF',
    status: 'PROCESSING',
    chunkCount: 0,
    createdAt: '2026-10-10T13:00:00Z',
    pollCount: 0,
  },
];

let mockDocuments = [...INITIAL_DOCUMENTS];
let docSequence = 7;

/**
 * Strips internal tracking fields and returns contract item:
 * { id, title, version, effectiveDate, category, region, fileType, status, chunkCount, createdAt }
 */
export function toDocumentItem(doc) {
  return {
    id: doc.id,
    title: doc.title,
    version: doc.version,
    effectiveDate: doc.effectiveDate,
    category: doc.category,
    region: doc.region,
    fileType: doc.fileType,
    status: doc.status,
    chunkCount: doc.chunkCount,
    createdAt: doc.createdAt,
  };
}

/**
 * Returns list of documents. Also simulates asynchronous processing:
 * any document in PROCESSING gets pollCount incremented; after 2 polls, it flips to READY.
 */
export function getDocumentsList() {
  mockDocuments.forEach((doc) => {
    if (doc.status === 'PROCESSING') {
      doc.pollCount = (doc.pollCount || 0) + 1;
      if (doc.pollCount >= 2) {
        doc.status = 'READY';
        doc.chunkCount = Math.floor(Math.random() * 5) + 3; // 3 to 7 chunks
      }
    }
  });

  return mockDocuments.map(toDocumentItem);
}

/**
 * Creates and registers an uploaded document mock.
 * Returns { id, status: 'PROCESSING' }
 */
export function addUploadedDocument(payload = {}) {
  const newId = `doc-${String(docSequence++).padStart(3, '0')}`;
  const now = new Date().toISOString();

  let fileType = 'PDF';
  if (payload.filename?.endsWith('.md') || payload.title?.endsWith('.md')) fileType = 'MD';
  else if (payload.filename?.endsWith('.json') || payload.title?.endsWith('.json')) fileType = 'JSON';

  const doc = {
    id: newId,
    title: payload.title || payload.filename || 'Uploaded Document',
    version: payload.version || 'v2026.1',
    effectiveDate: payload.effectiveDate || now.split('T')[0],
    category: payload.category || 'General',
    region: (payload.region || 'GLOBAL').toUpperCase(),
    fileType,
    status: 'PROCESSING',
    chunkCount: 0,
    createdAt: now,
    pollCount: 0,
  };

  mockDocuments.unshift(doc);
  return { id: doc.id, status: doc.status };
}
