import { post } from './client.js';

/**
 * POST /assistant/shop
 * AI-powered product discovery.
 * @param {string} message - user intent or query
 * @param {Array<{role: string, content: string}>} [history] - recent chat turns
 * @returns {Promise<{
 *   interpretedRequirement: string,
 *   budget: number|null,
 *   recommendations: Array<{productId: string, productName: string, reason: string, availability: string}>,
 *   clarifyingQuestion: string|null
 * }>}
 */
export function shop(message, history = []) {
  return post('/assistant/shop', { message, history });
}

/**
 * POST /assistant/ask
 * Grounded RAG assistant querying approved policy documents.
 * @param {string} question - user question
 * @param {string} [region] - optional region filter (e.g. 'GLOBAL', 'US', 'EU')
 * @returns {Promise<{
 *   answer: string,
 *   confidence: 'HIGH'|'MEDIUM'|'LOW',
 *   sources: Array<{document: string, section: string, version: string}>,
 *   followUpRequired: boolean
 * }>}
 */
export function ask(question, region) {
  return post('/assistant/ask', { question, region });
}
