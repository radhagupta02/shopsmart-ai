import { ApiError } from '../utils/ApiError.js';
import { handle as mockHandle } from '../mocks/index.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

/**
 * Resolve the auth token. We read directly from localStorage so the client
 * module stays decoupled from React (usable in non-component code).
 */
function getToken() {
  try {
    const raw = localStorage.getItem('ss_token');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * On 401 clear session and redirect to /login.
 * Imported lazily to avoid circular deps with AuthContext.
 */
function handleUnauthorized() {
  localStorage.removeItem('ss_token');
  localStorage.removeItem('ss_user');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

/** Reference to toast context – set once by the app shell. */
let _toast = null;

/**
 * Allow the app shell to inject the toast context so the client can surface
 * errors globally without requiring React imports in every module.
 */
export function setToastRef(toastCtx) {
  _toast = toastCtx;
}

/**
 * Core fetch wrapper.
 * @param {string} path - API path (e.g. '/products')
 * @param {Object} options
 * @param {string} options.method - HTTP method (default GET)
 * @param {Object} options.body - JSON body
 * @param {Object} options.query - query params
 * @param {boolean} options.raw - if true return the raw Response
 * @param {boolean} options.skipAuth - if true omit Authorization header
 * @returns {Promise<*>}
 */
export async function request(path, {
  method = 'GET',
  body,
  query,
  raw = false,
  skipAuth = false,
} = {}) {
  const token = skipAuth ? null : getToken();

  // ── Mock intercept ─────────────────────────────────────────────────────
  if (USE_MOCKS) {
    const mockResult = await mockHandle(method, path, { body, query, token });
    if (mockResult !== undefined) return mockResult;
    // undefined → fall through to real network
  }

  // ── Build URL ──────────────────────────────────────────────────────────
  let url = `${BASE_URL}${path}`;
  if (query) {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(query)) {
      if (val === undefined || val === null) continue;
      if (Array.isArray(val)) {
        val.forEach((v) => params.append(key, v));
      } else {
        params.append(key, String(val));
      }
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  // ── Headers ────────────────────────────────────────────────────────────
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // ── Fetch ──────────────────────────────────────────────────────────────
  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    const msg = 'Network error. Please check your connection.';
    _toast?.error(msg);
    throw new ApiError(msg, 0);
  }

  if (raw) return res;

  // ── 204 No Content ─────────────────────────────────────────────────────
  if (res.status === 204) return null;

  // ── Parse JSON ─────────────────────────────────────────────────────────
  let data;
  try {
    data = await res.json();
  } catch {
    if (res.ok) return null;
    const msg = `Unexpected response (${res.status})`;
    _toast?.error(msg);
    throw new ApiError(msg, res.status);
  }

  // ── Success ────────────────────────────────────────────────────────────
  if (res.ok) return data;

  // ── Error handling ─────────────────────────────────────────────────────
  const message = data?.error || `Request failed (${res.status})`;
  const details = data?.details || [];

  if (res.status === 401) {
    handleUnauthorized();
    throw new ApiError('Session expired. Please log in again.', 401, details);
  }

  _toast?.error(message);
  throw new ApiError(message, res.status, details);
}

/* ── Convenience methods ──────────────────────────────────────────────────── */

export const get = (path, query, opts) => request(path, { method: 'GET', query, ...opts });
export const post = (path, body, opts) => request(path, { method: 'POST', body, ...opts });
export const put = (path, body, opts) => request(path, { method: 'PUT', body, ...opts });
export const del = (path, opts) => request(path, { method: 'DELETE', ...opts });
