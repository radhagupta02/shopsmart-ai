/**
 * Mock system for frontend development.
 *
 * When VITE_USE_MOCKS=true, every API call first passes through handle().
 * If handle() returns undefined the call falls through to the real network.
 *
 * LIVE_ENDPOINTS: method+path patterns forced to the real API even in mock mode,
 * enabling incremental switching as backend endpoints go live.
 *
 * P0-B fills in the actual mock handlers.
 */

/** Endpoints that bypass mocks and go to the real API (method + path regex). */
const LIVE_ENDPOINTS = [
  // Example: { method: 'GET', pattern: /^\/health$/ },
];

/** Mock handlers keyed by 'METHOD /path' or regex-matched. P0-B adds entries. */
const handlers = {};

/**
 * Register a mock handler.
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string|RegExp} path - path string or regex
 * @param {Function} handler - (params) => response data | undefined
 */
export function registerMock(method, path, handler) {
  const key = `${method.toUpperCase()} ${path}`;
  handlers[key] = { method: method.toUpperCase(), path, handler };
}

/**
 * Check if an endpoint is forced live.
 */
function isLive(method, path) {
  return LIVE_ENDPOINTS.some(
    (ep) => ep.method === method.toUpperCase() && ep.pattern.test(path),
  );
}

/**
 * Attempt to handle a request via mocks.
 * @param {string} method - HTTP method
 * @param {string} path - API path (without base URL)
 * @param {Object} opts - { body, query, token }
 * @returns {Promise<*>} - resolved data, or undefined to fall through
 */
export async function handle(method, path, opts = {}) {
  const m = method.toUpperCase();

  // Force live endpoints to skip mocks
  if (isLive(m, path)) return undefined;

  // Try exact match first
  const exactKey = `${m} ${path}`;
  if (handlers[exactKey]) {
    // Simulate network delay so skeletons are visible
    await delay();
    return handlers[exactKey].handler(opts);
  }

  // Try regex matches
  for (const entry of Object.values(handlers)) {
    if (entry.method !== m) continue;
    if (entry.path instanceof RegExp && entry.path.test(path)) {
      await delay();
      const match = path.match(entry.path);
      return entry.handler({ ...opts, params: match?.groups || {}, match });
    }
  }

  // No mock found — fall through to real network
  return undefined;
}

/** Artificial delay so loading states are visible (100-300ms). */
function delay(ms) {
  const duration = ms ?? 100 + Math.random() * 200;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Dummy handler to prove mock fallthrough works during P0-A acceptance.
 * GET /health returns { status: 'ok', mock: true }.
 * Remove or override in P0-B.
 */
registerMock('GET', '/health', () => ({ status: 'ok', mock: true }));
