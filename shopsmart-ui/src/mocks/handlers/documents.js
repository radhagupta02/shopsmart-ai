import {
  getDocumentsList,
  addUploadedDocument,
} from '../data/documents.js';

export function handleListDocuments() {
  return getDocumentsList();
}

export function handleUploadDocument({ body }) {
  let payload = {};

  if (body instanceof FormData) {
    const file = body.get('file');
    payload = {
      filename: file?.name || 'document.pdf',
      title: body.get('title') || file?.name?.replace(/\.[^/.]+$/, '') || 'Uploaded Document',
      version: body.get('version') || 'v2026.1',
      effectiveDate: body.get('effectiveDate'),
      category: body.get('category') || 'General',
      region: body.get('region') || 'GLOBAL',
    };
  } else if (body && typeof body === 'object') {
    payload = { ...body };
  }

  return addUploadedDocument(payload);
}
