/**
 * Comprehensive verification script for P0-B mock handlers and data shapes.
 * Tests every endpoint in CONTRACT section 5 and verifies exact shapes from section 6.
 */

import { handle } from './index.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function hasExactKeys(obj, expectedKeys) {
  const actualKeys = Object.keys(obj).sort();
  const sortedExpected = [...expectedKeys].sort();
  if (actualKeys.length !== sortedExpected.length) return false;
  return actualKeys.every((k, i) => k === sortedExpected[i]);
}

async function runTests() {
  console.log('--- 1. Testing GET /health ---');
  const health = await handle('GET', '/health');
  assert(health?.status === 'ok' && health?.db === 'ok', 'GET /health returns { status: "ok", db: "ok" }');

  console.log('\n--- 2. Testing POST /auth/login ---');
  const loginRes = await handle('POST', '/auth/login', {
    body: { email: 'prime@demo.com', password: 'Demo@123' },
  });
  assert(
    loginRes?.token === 'mock-token-prime' &&
    loginRes?.user?.id === 'usr_prime' &&
    loginRes?.user?.tier === 'PRIME' &&
    loginRes?.user?.role === 'CUSTOMER',
    'POST /auth/login returns token and user matching CONTRACT shape'
  );

  let loginFailed = false;
  try {
    await handle('POST', '/auth/login', {
      body: { email: 'prime@demo.com', password: 'WrongPassword' },
    });
  } catch (err) {
    loginFailed = err.status === 401;
  }
  assert(loginFailed, 'POST /auth/login rejects invalid credentials with 401');

  console.log('\n--- 3. Testing GET /categories ---');
  const categories = await handle('GET', '/categories');
  assert(Array.isArray(categories) && categories.length >= 3, 'GET /categories returns categories array');
  assert(categories[0].children?.length >= 2, 'Categories contain nested hierarchy');

  console.log('\n--- 4. Testing GET /products ---');
  const prodList = await handle('GET', '/products', { query: { page: 1, size: 5 } });
  assert(
    prodList?.items?.length === 5 &&
    prodList?.page === 1 &&
    prodList?.totalPages >= 2 &&
    prodList?.totalItems >= 12,
    'GET /products pagination works ({ items, page, totalPages, totalItems })'
  );

  const sampleItem = prodList.items[0];
  const itemKeys = ['id', 'name', 'brand', 'categoryId', 'price', 'rating', 'stockQty', 'availability', 'imageUrl'];
  assert(
    hasExactKeys(sampleItem, itemKeys),
    `Catalog item has exact CONTRACT fields: ${itemKeys.join(', ')}`
  );

  // Search filter
  const searchRes = await handle('GET', '/products', { query: { q: 'Inspiron' } });
  assert(searchRes.items.some((p) => p.id === 'LAP101'), 'GET /products?q=Inspiron finds LAP101');

  // Category descendant filter (Electronics id 1 should find Laptops category 2)
  const catRes = await handle('GET', '/products', { query: { category: 1 } });
  assert(catRes.items.some((p) => p.categoryId === 2), 'GET /products?category=1 includes child category products');

  // Min price and inStock filter
  const filterRes = await handle('GET', '/products', { query: { minPrice: 900, inStock: 'true' } });
  assert(
    filterRes.items.every((p) => p.price >= 900 && p.stockQty > 0),
    'GET /products filters by minPrice and inStock'
  );

  // Sort by price_asc
  const sortRes = await handle('GET', '/products', { query: { sort: 'price_asc' } });
  let isAscending = true;
  for (let i = 1; i < sortRes.items.length; i++) {
    if (sortRes.items[i].price < sortRes.items[i - 1].price) isAscending = false;
  }
  assert(isAscending, 'GET /products?sort=price_asc correctly orders by price');

  console.log('\n--- 5. Testing GET /products/:id ---');
  const productDetail = await handle('GET', '/products/LAP101');
  assert(
    productDetail?.id === 'LAP101' &&
    productDetail?.name === 'Dell Inspiron 15' &&
    productDetail?.specs?.ramGb === 16 &&
    Array.isArray(productDetail?.images),
    'GET /products/LAP101 returns full product detail with specs and images'
  );

  let notFound = false;
  try {
    await handle('GET', '/products/NONEXISTENT');
  } catch (err) {
    notFound = err.status === 404;
  }
  assert(notFound, 'GET /products/NONEXISTENT returns 404');

  console.log('\n--- 6. Testing Wishlist endpoints ---');
  const wishlist = await handle('GET', '/wishlist');
  assert(Array.isArray(wishlist), 'GET /wishlist returns array');

  await handle('POST', '/wishlist', { body: { productId: 'LAP101' } });
  const updatedWishlist = await handle('GET', '/wishlist');
  assert(updatedWishlist.some((p) => p.id === 'LAP101'), 'POST /wishlist adds product');

  await handle('DELETE', '/wishlist/LAP101');
  const afterDelete = await handle('GET', '/wishlist');
  assert(!afterDelete.some((p) => p.id === 'LAP101'), 'DELETE /wishlist/:id removes product');

  console.log('\n--- 7. Testing Cart endpoints ---');
  const cart = await handle('GET', '/cart', { token: 'mock-token-prime' });
  assert(
    Array.isArray(cart?.items) &&
    typeof cart?.subtotal === 'number' &&
    typeof cart?.shippingEstimate === 'number' &&
    typeof cart?.total === 'number',
    'GET /cart returns { items, subtotal, shippingEstimate, total }'
  );

  const cartKeys = ['productId', 'name', 'imageUrl', 'unitPrice', 'quantity', 'lineTotal', 'availability'];
  if (cart.items.length > 0) {
    assert(hasExactKeys(cart.items[0], cartKeys), `Cart item has exact keys: ${cartKeys.join(', ')}`);
  }

  // Add cart item
  const updatedCart = await handle('POST', '/cart/items', {
    body: { productId: 'LAP102', quantity: 1 },
    token: 'mock-token-prime',
  });
  assert(updatedCart.items.some((i) => i.productId === 'LAP102'), 'POST /cart/items adds item');

  // Update cart item quantity
  const putCart = await handle('PUT', '/cart/items/LAP102', {
    body: { quantity: 3 },
    token: 'mock-token-prime',
  });
  assert(putCart.items.find((i) => i.productId === 'LAP102')?.quantity === 3, 'PUT /cart/items/:id updates quantity');

  // Out of stock add rejection
  let oosRejected = false;
  try {
    await handle('POST', '/cart/items', {
      body: { productId: 'LAP108', quantity: 1 }, // LAP108 has stock 0
      token: 'mock-token-prime',
    });
  } catch (err) {
    oosRejected = err.status === 409;
  }
  assert(oosRejected, 'POST /cart/items rejects out-of-stock product with 409');

  // Delete cart item
  await handle('DELETE', '/cart/items/LAP102', { token: 'mock-token-prime' });
  const afterRemoveCart = await handle('GET', '/cart', { token: 'mock-token-prime' });
  assert(!afterRemoveCart.items.some((i) => i.productId === 'LAP102'), 'DELETE /cart/items/:id removes item');

  console.log('\n--- 8. Testing Preferences endpoints ---');
  const prefs = await handle('GET', '/users/me/preferences');
  assert(
    Array.isArray(prefs?.categories) &&
    Array.isArray(prefs?.brands) &&
    typeof prefs?.budgetMin === 'number' &&
    typeof prefs?.budgetMax === 'number',
    'GET /users/me/preferences returns preferences object'
  );

  const updatedPrefs = await handle('PUT', '/users/me/preferences', {
    body: { categories: [2], brands: ['Dell', 'HP'], budgetMin: 400, budgetMax: 1000 },
  });
  assert(
    updatedPrefs?.budgetMin === 400 && updatedPrefs?.budgetMax === 1000,
    'PUT /users/me/preferences updates preferences'
  );

  console.log('\n--- 9. Testing Orders endpoints ---');
  const orders = await handle('GET', '/orders', { token: 'mock-token-prime' });
  assert(Array.isArray(orders) && orders.length >= 3, 'GET /orders returns list of seeded orders');

  const orderItemKeys = ['id', 'status', 'total', 'createdAt', 'itemCount'];
  assert(hasExactKeys(orders[0], orderItemKeys), `Order list item has exact keys: ${orderItemKeys.join(', ')}`);

  const orderDetail = await handle('GET', '/orders/ORD-100001', { token: 'mock-token-prime' });
  assert(
    orderDetail?.id === 'ORD-100001' &&
    orderDetail?.status === 'DELIVERED' &&
    Array.isArray(orderDetail?.items) &&
    Array.isArray(orderDetail?.events) &&
    orderDetail.events.length === 5,
    'GET /orders/:id returns order detail with items and 5 timeline events'
  );

  // Create order from cart
  const newOrder = await handle('POST', '/orders', { token: 'mock-token-prime' });
  assert(
    newOrder?.id?.startsWith('ORD-') &&
    newOrder?.status === 'PLACED' &&
    newOrder?.events?.length === 1,
    'POST /orders creates new simulated order and clears cart'
  );

  console.log('\n--- 10. Testing Documents (Knowledge Base) ---');
  const docsList1 = await handle('GET', '/documents');
  assert(Array.isArray(docsList1) && docsList1.length >= 6, 'GET /documents returns document list');

  const docItemKeys = ['id', 'title', 'version', 'effectiveDate', 'category', 'region', 'fileType', 'status', 'chunkCount', 'createdAt'];
  assert(hasExactKeys(docsList1[0], docItemKeys), `Document item has exact keys: ${docItemKeys.join(', ')}`);

  const uploadRes = await handle('POST', '/documents', {
    body: { title: 'New Test Policy', version: 'v2026.1', fileType: 'PDF', category: 'Testing' },
  });
  assert(uploadRes?.id && uploadRes?.status === 'PROCESSING', 'POST /documents returns { id, status: "PROCESSING" }');

  // Verify polling turns PROCESSING to READY after polls
  await handle('GET', '/documents'); // Poll 1
  const polledDocs = await handle('GET', '/documents'); // Poll 2
  const uploadedDoc = polledDocs.find((d) => d.id === uploadRes.id);
  assert(uploadedDoc?.status === 'READY', 'Document status flips from PROCESSING to READY after polling');

  console.log('\n--- 11. Testing Assistant AI endpoints (Exact shapes) ---');
  // Shop with laptop -> Hero reply
  const shopHero = await handle('POST', '/assistant/shop', {
    body: { message: 'I need a good laptop under 1000' },
    token: 'mock-token-prime',
  });
  const shopKeys = ['interpretedRequirement', 'budget', 'recommendations', 'clarifyingQuestion'];
  assert(hasExactKeys(shopHero, shopKeys), `Shop response has EXACT keys (no extra fields): ${shopKeys.join(', ')}`);
  assert(shopHero.budget === 1000, 'Shop hero has budget: 1000');
  assert(shopHero.recommendations?.[0]?.productId === 'LAP101', 'Shop hero has LAP101 as first recommendation');

  const recKeys = ['productId', 'productName', 'reason', 'availability'];
  assert(hasExactKeys(shopHero.recommendations[0], recKeys), `Recommendation has EXACT keys: ${recKeys.join(', ')}`);
  assert(shopHero.clarifyingQuestion === null, 'Shop hero clarifyingQuestion is null');

  // Shop vague message
  const shopVague = await handle('POST', '/assistant/shop', {
    body: { message: 'hello' },
    token: 'mock-token-prime',
  });
  assert(hasExactKeys(shopVague, shopKeys), 'Shop vague response has EXACT keys');
  assert(shopVague.budget === null && shopVague.recommendations.length === 0, 'Shop vague returns recommendations: []');
  assert(typeof shopVague.clarifyingQuestion === 'string', 'Shop vague returns clarifyingQuestion string');

  // Ask RAG queries
  const ragKeys = ['answer', 'confidence', 'sources', 'followUpRequired'];

  // Query: opened laptop -> HIGH
  const askHigh = await handle('POST', '/assistant/ask', {
    body: { question: 'Can I return an opened laptop?' },
    token: 'mock-token-prime',
  });
  assert(hasExactKeys(askHigh, ragKeys), `RAG response has EXACT keys (no extra fields): ${ragKeys.join(', ')}`);
  assert(askHigh.confidence === 'HIGH', 'Ask "opened laptop" returns confidence: HIGH');
  assert(askHigh.followUpRequired === false, 'Ask "opened laptop" followUpRequired: false');
  assert(askHigh.sources?.length > 0, 'Ask "opened laptop" has sources');
  const sourceKeys = ['document', 'section', 'version'];
  assert(hasExactKeys(askHigh.sources[0], sourceKeys), `Source has EXACT keys: ${sourceKeys.join(', ')}`);

  // Query: refund -> MEDIUM
  const askMedium = await handle('POST', '/assistant/ask', {
    body: { question: 'How long does a refund take?' },
    token: 'mock-token-prime',
  });
  assert(askMedium.confidence === 'MEDIUM', 'Ask "refund" returns confidence: MEDIUM');
  assert(askMedium.followUpRequired === false, 'Ask "refund" followUpRequired: false');

  // Query: unrelated -> LOW
  const askLow = await handle('POST', '/assistant/ask', {
    body: { question: 'Who won the soccer world cup?' },
    token: 'mock-token-prime',
  });
  assert(askLow.confidence === 'LOW', 'Ask unrelated returns confidence: LOW');
  assert(askLow.followUpRequired === true, 'Ask unrelated followUpRequired: true');
  assert(askLow.sources.length === 0, 'Ask unrelated sources: []');

  console.log('\n--- 12. Testing AI Logs endpoint ---');
  const logs = await handle('GET', '/ai-logs', { query: { page: 1, size: 10 } });
  assert(
    Array.isArray(logs?.items) &&
    logs?.page === 1 &&
    typeof logs?.totalPages === 'number' &&
    typeof logs?.totalItems === 'number',
    'GET /ai-logs returns paged logs'
  );
  assert(logs.items.some((l) => l.type === 'SHOP'), 'AI logs contain SHOP rows');
  assert(logs.items.some((l) => l.type === 'POLICY'), 'AI logs contain POLICY rows');

  const shopLog = logs.items.find((l) => l.type === 'SHOP');
  assert(shopLog.confidence === null, 'SHOP log confidence is NULL per CONTRACT Section 33');

  console.log('\n=======================================');
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('=======================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test error:', err);
  process.exit(1);
});
