import { env } from '../../config/env.js';
import * as gemini from './providers/gemini.js';

let provider;
if (env.LLM_PROVIDER === 'gemini') {
  provider = gemini;
} else {
  throw new Error(`Unsupported LLM provider: ${env.LLM_PROVIDER}`);
}

export const chat = provider.chat;
export const chatJson = provider.chatJson;
export const embed = provider.embed;
