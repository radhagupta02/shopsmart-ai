import { chatJson } from './aiClient.js';
import { logger } from '../../utils/logger.js';

const KEYWORDS = {
  POLICY: ['return', 'refund', 'warranty', 'delivery', 'cancel'],
  SHOP: ['suggest', 'find', 'under', 'best'],
  ORDER: ['where is my order', 'track my order', 'order status']
};

export const route = async (message) => {
  const msgLower = message.toLowerCase();
  
  for (const word of KEYWORDS.ORDER) {
    if (msgLower.includes(word)) return 'ORDER';
  }
  for (const word of KEYWORDS.POLICY) {
    if (msgLower.includes(word)) return 'POLICY';
  }
  for (const word of KEYWORDS.SHOP) {
    if (msgLower.includes(word)) return 'SHOP';
  }
  
  try {
    const prompt = `
Classify the user's message into one of these intents:
- POLICY: Questions about returns, shipping, warranties, or store policies.
- SHOP: Looking to buy products, asking for recommendations, or searching.
- ORDER: Checking the status of an existing order.
- UNKNOWN: Anything else.

Message: "${message}"

Reply with JSON: { "intent": "POLICY" | "SHOP" | "ORDER" | "UNKNOWN" }
`;
    
    const result = await chatJson([{ role: 'user', content: prompt }], {
      temperature: 0,
      systemInstruction: 'Reply strictly with the JSON schema requested.'
    });
    
    if (['POLICY', 'SHOP', 'ORDER', 'UNKNOWN'].includes(result.intent)) {
      return result.intent;
    }
    
    return 'UNKNOWN';
  } catch (err) {
    logger.error('Intent routing LLM failed, falling back to UNKNOWN', err);
    return 'UNKNOWN';
  }
};
