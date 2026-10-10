import { handleLogin } from './auth.js';
import { handleListProducts, handleGetProduct, handleGetCategories } from './products.js';
import {
  handleGetCart,
  handleAddCartItem,
  handleUpdateCartItem,
  handleDeleteCartItem,
} from './cart.js';
import { handleGetWishlist, handleAddWishlist, handleDeleteWishlist } from './wishlist.js';
import { handleGetPreferences, handleUpdatePreferences } from './preferences.js';
import { handleListOrders, handleGetOrder, handleCreateOrder } from './orders.js';
import { handleListDocuments, handleUploadDocument } from './documents.js';
import { handleAssistantShop, handleAssistantAsk } from './assistant.js';
import { handleListAiLogs } from './aiLogs.js';
import { handleHealth } from './health.js';

/**
 * Route table mapping HTTP Method + path pattern to handler.
 * Each entry has:
 * - method: uppercase HTTP verb
 * - pattern: string (exact match) or RegExp (with named capture groups)
 * - handler: ({ body, query, token, params }) => response
 */
export const ROUTE_TABLE = [
  // Health
  { method: 'GET', pattern: '/health', handler: handleHealth },

  // Auth
  { method: 'POST', pattern: '/auth/login', handler: handleLogin },

  // Catalog
  { method: 'GET', pattern: '/categories', handler: handleGetCategories },
  { method: 'GET', pattern: '/products', handler: handleListProducts },
  { method: 'GET', pattern: /^\/products\/(?<id>[^/?#]+)$/, handler: handleGetProduct },

  // Wishlist
  { method: 'GET', pattern: '/wishlist', handler: handleGetWishlist },
  { method: 'POST', pattern: '/wishlist', handler: handleAddWishlist },
  { method: 'DELETE', pattern: /^\/wishlist\/(?<productId>[^/?#]+)$/, handler: handleDeleteWishlist },

  // Cart
  { method: 'GET', pattern: '/cart', handler: handleGetCart },
  { method: 'POST', pattern: '/cart/items', handler: handleAddCartItem },
  { method: 'PUT', pattern: /^\/cart\/items\/(?<id>[^/?#]+)$/, handler: handleUpdateCartItem },
  { method: 'DELETE', pattern: /^\/cart\/items\/(?<id>[^/?#]+)$/, handler: handleDeleteCartItem },

  // Preferences
  { method: 'GET', pattern: '/users/me/preferences', handler: handleGetPreferences },
  { method: 'PUT', pattern: '/users/me/preferences', handler: handleUpdatePreferences },

  // Orders
  { method: 'POST', pattern: '/orders', handler: handleCreateOrder },
  { method: 'GET', pattern: '/orders', handler: handleListOrders },
  { method: 'GET', pattern: /^\/orders\/(?<id>[^/?#]+)$/, handler: handleGetOrder },

  // Documents (Knowledge Base)
  { method: 'POST', pattern: '/documents', handler: handleUploadDocument },
  { method: 'GET', pattern: '/documents', handler: handleListDocuments },

  // Assistant
  { method: 'POST', pattern: '/assistant/shop', handler: handleAssistantShop },
  { method: 'POST', pattern: '/assistant/ask', handler: handleAssistantAsk },

  // AI Logs
  { method: 'GET', pattern: '/ai-logs', handler: handleListAiLogs },
];
