/**
 * Mock system for frontend development.
 *
 * When VITE_USE_MOCKS=true, every API call first passes through handle().
 * If handle() returns undefined the call falls through to the real network.
 *
 * All endpoints from CONTRACT Section 5 are registered via ROUTE_TABLE.
 */

import { ROUTE_TABLE } from './handlers/index.js';

/** Endpoints that bypass mocks and go to the real API (method + path regex). */
const LIVE_ENDPOINTS = [
  // Example: { method: 'GET', pattern: /^\/health$/ },
];

/** Dynamic handlers registered via registerMock() */
const dynamicHandlers = {};

/**
 * Register a dynamic mock handler.
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string|RegExp} path - path string or regex
 * @param {Function} handler - (params) => response data | undefined
 */
export function registerMock(method, path, handler) {
  const key = `${method.toUpperCase()} ${path}`;
  dynamicHandlers[key] = { method: method.toUpperCase(), path, handler };
}

/**
 * Check if an endpoint is forced live.
 */
function isLive(method, path) {
  return LIVE_ENDPOINTS.some(
    (ep) => ep.method === method.toUpperCase() && ep.pattern.test(path),
  );
}

/** Artificial delay so loading states and skeletons are visible (300-600ms). */
function delay(ms) {
  const duration = ms ?? (300 + Math.random() * 300);
  return new Promise((resolve) => setTimeout(resolve, duration));
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

  // 1. Check dynamic handlers first (exact match)
  const exactKey = `${m} ${path}`;
  if (dynamicHandlers[exactKey]) {
    await delay();
    return dynamicHandlers[exactKey].handler(opts);
  }

  // 2. Check dynamic handlers (regex)
  for (const entry of Object.values(dynamicHandlers)) {
    if (entry.method !== m) continue;
    if (entry.path instanceof RegExp && entry.path.test(path)) {
      await delay();
      const match = path.match(entry.path);
      return entry.handler({ ...opts, params: match?.groups || {}, match });
    }
  }

  // 3. Match against ROUTE_TABLE
  for (const route of ROUTE_TABLE) {
    if (route.method !== m) continue;

    // String exact match
    if (typeof route.pattern === 'string' && route.pattern === path) {
      await delay();
      return route.handler({ ...opts, params: {} });
    }

    // RegExp pattern match
    if (route.pattern instanceof RegExp && route.pattern.test(path)) {
      await delay();
      const match = path.match(route.pattern);
      return route.handler({ ...opts, params: match?.groups || {}, match });
    }
  }

  // No mock found — fall through to real network
  return undefined;
}
