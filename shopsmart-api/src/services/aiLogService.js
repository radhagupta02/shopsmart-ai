import { query } from '../../config/db.js';

export const record = async (logData) => {
  const { userId, type, question, response, confidence, sources, latencyMs } = logData;
  await query(`
    INSERT INTO ai_logs (user_id, type, question, response, confidence, sources, latency_ms)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `, [userId, type, question, JSON.stringify(response), confidence, JSON.stringify(sources), latencyMs]);
};

export const getLogs = async (typeFilter, page = 1, size = 10) => {
  const limit = Math.min(parseInt(size) || 10, 50);
  const offset = (Math.max(parseInt(page) || 1, 1) - 1) * limit;
  
  let countQ = \`SELECT COUNT(*) FROM ai_logs\`;
  let q = \`
    SELECT a.id, a.type, a.question, a.response, a.confidence, a.sources, a.latency_ms as "latencyMs", a.created_at as "createdAt", u.name as "userName"
    FROM ai_logs a
    LEFT JOIN users u ON a.user_id = u.id
  \`;
  const params = [];
  
  if (typeFilter) {
    countQ += \` WHERE type = $1\`;
    q += \` WHERE a.type = $1\`;
    params.push(typeFilter);
  }
  
  q += \` ORDER BY a.created_at DESC LIMIT $\${params.length + 1} OFFSET $\${params.length + 2}\`;
  
  const countRes = await query(countQ, params);
  const totalItems = parseInt(countRes.rows[0].count);
  
  params.push(limit, offset);
  const res = await query(q, params);
  
  return {
    items: res.rows,
    page: parseInt(page) || 1,
    totalPages: Math.ceil(totalItems / limit),
    totalItems
  };
};
