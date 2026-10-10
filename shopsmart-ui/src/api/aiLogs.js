import { get } from './client.js';

/**
 * GET /ai-logs
 * Paged audit log of AI SHOP and POLICY interactions (Admin only).
 * @param {Object} [params] - { page, size, type }
 * @returns {Promise<{
 *   items: Array<{
 *     id: string,
 *     userId: string,
 *     userName: string,
 *     type: 'SHOP'|'POLICY',
 *     question: string,
 *     response: Object,
 *     confidence: 'HIGH'|'MEDIUM'|'LOW'|null,
 *     sources: Array<Object>|null,
 *     latencyMs: number,
 *     createdAt: string
 *   }>,
 *   page: number,
 *   totalPages: number,
 *   totalItems: number
 * }>}
 */
export function listLogs(params = {}) {
  return get('/ai-logs', params);
}
