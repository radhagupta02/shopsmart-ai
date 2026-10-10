import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../../config/env.js';
import { AppError } from '../../../utils/AppError.js';
import { logger } from '../../../utils/logger.js';

const genAI = new GoogleGenerativeAI(env.LLM_API_KEY);

const getModel = (modelName, systemInstruction) => {
  return genAI.getGenerativeModel({ model: modelName, systemInstruction });
};

const retryOperation = async (operation, maxRetries = 1) => {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      return await Promise.race([
        operation(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
      ]);
    } catch (err) {
      const isRetryable = err.status >= 500 || err.status === 429 || err.name === 'FetchError' || err.message === 'Timeout' || !err.status;
      if (attempt === maxRetries || !isRetryable) {
        throw err;
      }
      attempt++;
      await new Promise(res => setTimeout(res, 1000 * attempt));
    }
  }
};

const stripMarkdownFences = (text) => {
  let cleanText = text.trim();
  if (cleanText.startsWith('```json')) cleanText = cleanText.substring(7);
  else if (cleanText.startsWith('```')) cleanText = cleanText.substring(3);
  if (cleanText.endsWith('```')) cleanText = cleanText.substring(0, cleanText.length - 3);
  return cleanText.trim();
};

export const chat = async ({ system, user, temperature }) => {
  const start = Date.now();
  const model = getModel(env.LLM_MODEL, system);
  try {
    const response = await retryOperation(async () => {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { temperature }
      });
      return result.response.text();
    });
    
    return {
      data: response,
      provider: env.LLM_PROVIDER,
      model: env.LLM_MODEL,
      latencyMs: Date.now() - start
    };
  } catch (err) {
    logger.error({ err }, 'AI chat failed');
    throw new AppError('AI service unavailable', 503);
  }
};

export const chatJson = async ({ system, user, schema, temperature }) => {
  const start = Date.now();
  const model = getModel(env.LLM_MODEL, system);
  
  let attempt = 0;
  let currentUser = user;

  while (attempt <= 1) {
    try {
      const responseText = await retryOperation(async () => {
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: currentUser }] }],
          generationConfig: { temperature, responseMimeType: 'application/json' }
        });
        return result.response.text();
      });
      
      const cleanJson = stripMarkdownFences(responseText);
      const parsedData = JSON.parse(cleanJson);
      
      if (schema) {
        const validated = schema.safeParse(parsedData);
        if (!validated.success) {
          throw new Error('Zod validation failed: ' + JSON.stringify(validated.error.errors));
        }
        return {
          data: validated.data,
          provider: env.LLM_PROVIDER,
          model: env.LLM_MODEL,
          latencyMs: Date.now() - start
        };
      }

      return {
        data: parsedData,
        provider: env.LLM_PROVIDER,
        model: env.LLM_MODEL,
        latencyMs: Date.now() - start
      };
      
    } catch (err) {
      if (attempt === 0 && (err instanceof SyntaxError || err.message.startsWith('Zod validation failed'))) {
        logger.warn({ err: err.message }, 'AI JSON parsing/validation failed, retrying once');
        currentUser = `${user}\n\nPREVIOUS ERROR: Your previous response failed validation: ${err.message}. Please strictly follow the schema.`;
        attempt++;
        continue;
      }
      logger.error({ err }, 'AI chatJson failed');
      throw new AppError('AI service unavailable', 503);
    }
  }
};

export const embed = async (texts, kind) => {
  const start = Date.now();
  const model = genAI.getGenerativeModel({ model: env.EMBEDDING_MODEL });
  
  try {
    const embeddings = await retryOperation(async () => {
      const taskType = kind === 'query' ? 'RETRIEVAL_QUERY' : 'RETRIEVAL_DOCUMENT';
      const requests = texts.map(text => 
        model.embedContent({ content: { role: 'user', parts: [{ text }] }, taskType })
      );
      
      const results = await Promise.all(requests);
      return results.map(r => r.embedding.values);
    });
    
    return {
      data: embeddings,
      provider: env.LLM_PROVIDER,
      model: env.EMBEDDING_MODEL,
      latencyMs: Date.now() - start
    };
  } catch (err) {
    logger.error({ err }, 'AI embed failed');
    throw new AppError('AI service unavailable', 503);
  }
};
