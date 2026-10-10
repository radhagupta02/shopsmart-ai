# CONTRACT (source of truth)
Tags: [PLAN] from the Full-Stack Plan or the problem statement. [PROPOSED] derived so parallel work can start; confirm or change in P0-ALL, then it is locked. [BP] carried from the previous build pack.

## 1 Conventions
- [PLAN] All routes are prefixed /api. Protected routes need Authorization: Bearer <token>. Errors always { "error": "message", "details": [...] }. Statuses: 400 validation (with field details), 401 unauthenticated, 403 wrong role, 404 not found, 413 file too large, 415 unsupported file type, 500 generic.
- [PLAN] JSON field names are camelCase (as in the plan's examples); DB columns snake_case. Product id is a string like LAP101.
- [PROPOSED] details item = { field, message }. Page numbers are 1-based; size default 12, max 50. Money is a number with 2 decimals in USD (statement example uses $). Dates and times are ISO-8601 UTC. Success codes: 201 for creates (POST /orders, POST /documents, POST /cart/items, POST /wishlist), 200 otherwise, DELETE returns 204. Other ids are UUID strings except categories (integer) and orders (see section 4).
- [PROPOSED] AI provider failure after retry: 503 { "error": "AI service unavailable" } (the plan's status list has no AI-specific code). The UI shows a friendly message with retry.
- [PLAN] Public: POST /auth/login. [PROPOSED] Also public: GET /products, GET /products/:id, GET /categories, GET /health. Everything else needs a token. ADMIN-only: POST /documents, GET /documents, GET /ai-logs.

## 2 Enums
- [PLAN] tier: BASIC | PRIME | PREMIUM. role: CUSTOMER | ADMIN. confidence: HIGH | MEDIUM | LOW. document status: PROCESSING | READY | FAILED. ai_logs type: SHOP | POLICY. file_type: PDF | MD | JSON (plan lists "PDF / Markdown / JSON"; [PROPOSED] stored as these three values).
- [PLAN, from the statement example] availability IN_STOCK. [PROPOSED] full set IN_STOCK | LOW_STOCK | OUT_OF_STOCK (plan badges: In Stock, Low Stock, Out of Stock); stock_qty = 0 -> OUT_OF_STOCK; stock_qty from 1 to 5 -> LOW_STOCK; above 5 -> IN_STOCK. The threshold is a single constant in productService.js.
- [PLAN] order status timeline: Placed, Packed, Shipped, Out for delivery, Delivered. [PROPOSED] values PLACED | PACKED | SHIPPED | OUT_FOR_DELIVERY | DELIVERED.

## 3 Environment
- shopsmart-api/.env.example: [PLAN] PORT=5000, DATABASE_URL, JWT_SECRET, LLM_API_KEY, EMBEDDING_MODEL. [PROPOSED] LLM_PROVIDER, LLM_MODEL, EMBEDDING_DIM (must equal the provider's output and the vector column; changing it requires npm run db:init), CORS_ORIGINS=http://localhost:5173, JWT_TTL (token lifetime; value to be chosen in P0-C and recorded).
- shopsmart-ui/.env.example: [PLAN] VITE_API_BASE_URL=http://localhost:5000/api, VITE_USE_MOCKS=true.

## 4 Data model [PLAN: tables and columns from plan section 5; types are [PROPOSED]]
users(id, name, email unique, password_hash, tier, role, created_at)
user_preferences(user_id fk, categories[], brands[], budget_min, budget_max)
categories(id, name, parent_id self fk)
products(id varchar e.g. LAP101, name, category_id fk, brand, description, price numeric(10,2), rating numeric(2,1), stock_qty int, specs jsonb, images text[])
inventory (optional) (product_id, warehouse_id, qty)
wishlist_items(user_id, product_id, pk both); cart_items(user_id, product_id, quantity, pk (user_id, product_id))
orders(id, user_id, status, total, shipping_estimate, created_at); order_items(order_id, product_id, quantity, unit_price); order_events(order_id, status, note, event_time)
documents(id, title, version, effective_date, category, region, file_type, status, chunk_count, uploaded_by, created_at)
document_chunks(id, document_id fk on delete cascade, section, chunk_index, content, embedding vector(N))
ai_logs(id, user_id, type, question, response jsonb, confidence, sources jsonb, latency_ms, created_at)
- [PROPOSED] orders.id is a human-readable string ORD-100001 upward, generated from a database sequence (shown to users and used by the order-status tool). document/user/ai_logs ids are UUID.
- [PROPOSED] Indexes (plan): products(category_id, price, brand), full-text on products(name, description), HNSW or IVFFlat on document_chunks.embedding (check the pgvector README for dimension limits first), documents(status, category, region). N = EMBEDDING_DIM (OQ-2).
- [PROPOSED] ai_logs.confidence is NULL for SHOP rows (shopping has no confidence field).

## 5 Endpoints
Auth: [PLAN] POST /auth/login {email, password} -> {token, user:{id, name, tier, role}}.
Catalog: [PLAN] GET /products?q&category&brand&minPrice&maxPrice&sort&page&size -> {items, page, totalPages, totalItems}. [PROPOSED] extra query params minRating and inStock (needed by the plan's rating and in-stock filters); brand repeatable; category = category id and includes its descendants; sort = relevance | price_asc | price_desc | rating | newest (invalid -> 400). q uses the full-text index; partial words must also match (combine with ILIKE if needed). Item = {id, name, brand, categoryId, price, rating, stockQty, availability, imageUrl (first of images)}.
[PLAN] GET /products/:id -> full product with specs and images. [PROPOSED] = item fields + {description, specs{}, images[]}.
[PLAN] GET /categories -> tree (parent with children). [PROPOSED] [{id, name, children:[...]}].
Compare: the plan defines NO compare endpoint. The Compare page builds its table client-side from GET /products/:id.
Wishlist: [PLAN] GET /wishlist (list), POST /wishlist (add), DELETE /wishlist/:productId (remove). [PROPOSED] POST body {productId}; GET returns [item]; add is idempotent.
Cart: [PLAN] GET /cart, POST /cart/items, PUT /cart/items/:id, DELETE /cart/items/:id with quantity. [PROPOSED] :id = productId (cart_items has no separate id); POST {productId, quantity}; PUT {quantity}; quantity 1..10; GET -> {items:[{productId, name, imageUrl, unitPrice, quantity, lineTotal, availability}], subtotal, shippingEstimate, total}. shippingEstimate is a COST (the plan shows it next to subtotal and total), computed from the Shipping Policy facts in section 7 by tier and subtotal. Out-of-stock add -> 409.
Preferences: [PLAN] GET/PUT /users/me/preferences (categories, brands, budget range). [PROPOSED] {categories:[categoryId], brands:[string], budgetMin, budgetMax}.
Orders: [PLAN] POST /orders (create a simulated order from the cart), GET /orders, GET /orders/:id (detail with events[]). [PROPOSED] POST needs no body, clears the cart, decrements stock in one transaction, 409 on empty cart or insufficient stock, returns the detail. List item {id, status, total, createdAt, itemCount}. Detail = list item + {shippingEstimate, items:[{productId, name, quantity, unitPrice}], events:[{status, note, eventTime}]}. Another user's order -> 404. Mock events: see section 7.
Documents: [PLAN] POST /documents (multipart: file + version, effectiveDate, category, region) -> {id, status:'PROCESSING'}; GET /documents -> list with status and chunkCount (UI polls until READY). [PROPOSED] extra optional multipart field title (the plan lists none, but citations need the document title; default = file name without extension). Allowed .pdf .md .json, about 10 MB (413 above, 415 other types), empty extracted text -> 400. List item {id, title, version, effectiveDate, category, region, fileType, status, chunkCount, createdAt}. Failed ingestion -> status FAILED.
Assistant: [PLAN] POST /assistant/shop {message, history?} -> shopping JSON (section 6). [PLAN] POST /assistant/ask {question, region?} -> RAG JSON (section 6). [PROPOSED] history = [{role:'user'|'assistant', content}] (last few turns). [PROPOSED, needs OQ-5] POST /assistant/chat {message, history?, region?} -> {type:'SHOP'|'POLICY'|'ORDER', ...} where SHOP/POLICY wrap the two shapes in section 6 and ORDER returns the order-status result; not built until OQ-5 is decided.
AI log: [PLAN] GET /ai-logs (ADMIN, paged). [PROPOSED] ?page&size&type -> {items:[{id, userId, userName, type, question, response, confidence, sources, latencyMs, createdAt}], page, totalPages, totalItems}.
Health: [PROPOSED] GET /health -> {status:'ok', db:'ok'}.

## 6 AI shapes [PLAN, exact statement formats; no extra fields]
Shopping response: { "interpretedRequirement": string, "budget": number|null, "recommendations": [{ "productId", "productName", "reason", "availability" }], "clarifyingQuestion": string|null }. Rules: budget null when not stated; recommendations are real catalog products only: the top 3, each with a one-line reason built from real product fields; availability from the database; budget or category missing -> recommendations [] and a clarifyingQuestion; saved preferences influence ranking.
RAG response: { "answer": string, "confidence": "HIGH"|"MEDIUM"|"LOW", "sources": [{ "document", "section", "version" }], "followUpRequired": boolean }. Rules: sources come from chunk metadata, never from the LLM; below the LOW threshold: answer says the information is not in the approved documents, confidence LOW, sources [], followUpRequired true.
[PROPOSED] region filter on /assistant/ask: if region is sent, only documents whose region equals it or equals GLOBAL are searched; if omitted, all READY documents. Document region values are free text set at upload; GLOBAL is the shared value.
[PROPOSED] Mock events (orderService.js): when an order is created, PLACED is recorded now and the later steps (PACKED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED) get scheduled eventTime values at fixed offsets; the API returns events whose eventTime has passed with their status, so the timeline progresses over time. Seeded orders for the demo users are pre-populated at different stages (section 7).

## 7 Seed data and shared fact sheet (carried from the previous pack [BP]; confirm in P0-ALL, all content is fictional)
Users (hash passwords with bcrypt): admin@shopsmart.ai / Admin@123 (ADMIN, PREMIUM); basic@demo.com / Demo@123 (BASIC); prime@demo.com / Demo@123 (PRIME); premium@demo.com / Demo@123 (PREMIUM). Plan: 3 demo users (Basic, Prime, Premium) plus 1 admin.
Categories (hierarchy): Electronics (Laptops, Smartphones, Audio); Fashion (Footwear); Books (Technology, Fiction). Add parents from the statement list (Home Appliances, Healthcare, Groceries) only if products need them.
Products: about 40, including 10 laptops, plus phones, headphones, shoes and books (counts decided in C1 and recorded). Fictional but realistic; each has id (3-letter prefix + number), name, category, brand, description, price, rating 3.6-4.9, stock_qty, specs jsonb, images. Laptop specs: cpu, ramGb, storageGb, storageType, gpu, displayInches, weightKg, batteryHours, os. Hero requirements (the demo depends on them): LAP101 "Dell Inspiron 15" (Intel i7, 16 GB RAM, 512 GB SSD, 899 USD, rating 4.4, in stock); at least 4 laptops under 1000 USD with ramGb >= 16 (including LAP101), at least one of them with a dedicated GPU; 2 budget laptops with 8 GB RAM; 3 premium laptops between 1400 and 2400 USD, one of them with stock_qty 0; about 4 products overall with low stock. images: https://picsum.photos/seed/<id>/600/450.
Seeded orders (plan: orders simulated, events mocked): prime@demo.com has one DELIVERED (containing LAP101), one SHIPPED, one PLACED; basic@demo.com has one SHIPPED.
Policy facts (must be IDENTICAL in the four sample documents and anywhere they are quoted):
- Laptop Return Policy v2026.1 (Electronics, GLOBAL), sections: Unopened Products (30 days, full refund); Opened Products (returnable within 7 days of delivery if no physical damage, with accessories, original packaging and a factory reset); Damaged or Defective Products (defective on arrival: replacement or refund within 15 days; customer-caused physical damage is not returnable, warranty may apply).
- Refund Policy v2026.1: refund within 5-7 business days after the returned item passes inspection (inspection takes 1-2 business days); Prime and Premium refunds start at the pickup scan and credit within 2-3 business days; methods: original payment method or ShopSmart Wallet (instant).
- Shipping Policy v2026.2 (GLOBAL): Standard 3-5 business days, Express 1-2. Basic: free standard shipping on orders of 50 USD or more, otherwise 4.99; express 9.99. Prime: free standard on all orders, express 4.99. Premium: free express on all orders. Cancellation is free before shipment; after shipment an order cannot be cancelled, so refuse delivery or return it within the return window.
- Warranty and Membership Benefits v2026.1 (sections Warranty Periods, Membership Benefits): warranty smartphones 12 months, laptops 12, tablets 12, headphones 6, home appliances 24; accidental damage excluded; Premium adds 6 months on electronics. Basic (free): free standard shipping on 50 USD or more, 30-day returns. Prime (9.99 USD/month): free standard delivery on all orders, discounted express, early deal access, free return pickup. Premium (19.99 USD/month): free express delivery, 45-day returns, 6 extra months of warranty on electronics, 24/7 phone support.
Sample document formats [PROPOSED, so all three required formats are exercised]: Laptop Return Policy .md; Shipping Policy .md; Refund Policy .md; Warranty and Membership Benefits .json; plus a PDF version of one of them generated by script for the PDF ingestion test. Each has Version, Effective Date (a 2026 date before today), Category, Region metadata.
Expected demo answers: opened laptop = 7 days if no physical damage; refund timeline = 5-7 business days after inspection (Prime/Premium 2-3 after pickup scan); Prime free delivery = yes, standard on all orders; cancel after shipment = not possible; smartphone warranty = 12 months. Out-of-scope example: "Who won the cricket world cup?" -> not in approved documents, LOW, followUpRequired true.
Cart shippingEstimate [PROPOSED, derived from the Shipping Policy]: standard shipping; Basic: 0 if subtotal >= 50 else 4.99; Prime: 0; Premium: 0.

## 8 Frontend routes [PLAN screens]
/login, / (Home), /products, /products/:id, /compare, /cart, /wishlist, /assistant (plus the floating panel on every page), /orders, /orders/:id, /profile, /admin/knowledge, /admin/ai-log. Protected routes need login; /admin/* needs role ADMIN. Header: logo, search, cart badge, wishlist, user menu with tier; toasts; mobile hamburger.

## 9 Mock rules (frontend)
shopsmart-ui/src/mocks returns exactly the shapes above, with a small artificial delay so skeletons are visible. Must include: the hero shopping reply (LAP101 first); a clarifyingQuestion reply (recommendations []); RAG replies for HIGH (opened laptop), MEDIUM, and LOW (out-of-scope, followUpRequired true); documents in PROCESSING, READY and FAILED; an order with events at several stages; an ai-log list with SHOP and POLICY rows.
