import { recordAiLog } from '../data/aiLogs.js';
import { findUserByToken } from '../data/users.js';

/**
 * Mock handler for POST /assistant/shop
 * EXACT CONTRACT SHAPE:
 * {
 *   "interpretedRequirement": string,
 *   "budget": number | null,
 *   "recommendations": [{ "productId", "productName", "reason", "availability" }],
 *   "clarifyingQuestion": string | null
 * }
 */
export function handleAssistantShop({ body, token }) {
  const message = (body?.message || '').toLowerCase();
  const user = findUserByToken(token);

  let response;

  if (message.includes('laptop')) {
    // Hero reply per CONTRACT Section 6, 7, 9
    response = {
      interpretedRequirement: 'Laptop under $1000 with 16GB RAM for productivity and multitasking',
      budget: 1000,
      recommendations: [
        {
          productId: 'LAP101',
          productName: 'Dell Inspiron 15',
          reason: 'Intel Core i7-1355U with 16GB RAM and 512GB SSD priced at $899 fits your $1000 budget perfectly',
          availability: 'IN_STOCK',
        },
        {
          productId: 'LAP102',
          productName: 'Lenovo IdeaPad Gaming 3',
          reason: 'Dedicated NVIDIA RTX 4050 GPU and 16GB RAM at $949 provides outstanding performance under $1000',
          availability: 'IN_STOCK',
        },
        {
          productId: 'LAP103',
          productName: 'HP Pavilion 15',
          reason: 'AMD Ryzen 7 7730U with 16GB RAM at $829 delivers great value within your budget',
          availability: 'LOW_STOCK',
        },
      ],
      clarifyingQuestion: null,
    };
  } else {
    // Vague message reply per CONTRACT Section 6, 9
    response = {
      interpretedRequirement: 'Looking for product recommendations without specified category or budget',
      budget: null,
      recommendations: [],
      clarifyingQuestion: 'What type of product are you looking for, and do you have a specific budget in mind?',
    };
  }

  // Record audit log
  recordAiLog({
    userId: user?.id || 'usr_prime',
    userName: user?.name || 'Prime User',
    type: 'SHOP',
    question: body?.message || 'Product discovery query',
    response,
    confidence: null,
    sources: null,
    latencyMs: 420,
  });

  return response;
}

/**
 * Mock handler for POST /assistant/ask
 * EXACT CONTRACT SHAPE:
 * {
 *   "answer": string,
 *   "confidence": "HIGH" | "MEDIUM" | "LOW",
 *   "sources": [{ "document", "section", "version" }],
 *   "followUpRequired": boolean
 * }
 */
export function handleAssistantAsk({ body, token }) {
  const question = (body?.question || body?.message || '').toLowerCase();
  const user = findUserByToken(token);

  let response;

  if (question.includes('opened laptop')) {
    // HIGH confidence reply per CONTRACT Section 7, 9
    response = {
      answer: 'Opened laptops can be returned within 7 days of delivery provided there is no physical damage, all accessories and original packaging are included, and a factory reset has been performed.',
      confidence: 'HIGH',
      sources: [
        {
          document: 'Laptop Return Policy',
          section: 'Opened Products',
          version: 'v2026.1',
        },
      ],
      followUpRequired: false,
    };
  } else if (question.includes('refund')) {
    // MEDIUM confidence reply per CONTRACT Section 7, 9
    response = {
      answer: 'Refunds are processed within 5-7 business days after the returned item passes inspection (which takes 1-2 business days). For Prime and Premium members, refunds initiate at pickup scan and credit within 2-3 business days.',
      confidence: 'MEDIUM',
      sources: [
        {
          document: 'Refund Policy',
          section: 'Inspection and Processing',
          version: 'v2026.1',
        },
      ],
      followUpRequired: false,
    };
  } else {
    // LOW confidence out-of-scope reply per CONTRACT Section 6, 7, 9
    response = {
      answer: 'This information is not available in the approved policy documents.',
      confidence: 'LOW',
      sources: [],
      followUpRequired: true,
    };
  }

  // Record audit log
  recordAiLog({
    userId: user?.id || 'usr_prime',
    userName: user?.name || 'Prime User',
    type: 'POLICY',
    question: body?.question || body?.message || 'Policy question',
    response,
    confidence: response.confidence,
    sources: response.sources,
    latencyMs: 380,
  });

  return response;
}
