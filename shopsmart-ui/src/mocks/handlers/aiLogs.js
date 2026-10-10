import { listAiLogs } from '../data/aiLogs.js';

export function handleListAiLogs({ query = {} }) {
  const { page, size, type } = query;
  return listAiLogs({ page, size, type });
}
