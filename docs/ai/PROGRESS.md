# PROGRESS (update after every task)

## Decisions
(date - decision - why)  Record here: OQ answers, provider + embedding dimension, Node/Express versions, JWT lifetime, final confidence thresholds, signed-off [PROPOSED] items.
- 2026-10-10 - Node v22.19.0, npm 10.9.3 confirmed on dev machine.
- 2026-10-10 - Home page "Trending" row uses GET /products?sort=rating until the team decides otherwise.

- OQ-1: Organizers confirmed Node.js + Express is accepted.
- OQ-2: Provider = Google Gemini API (AI Studio). LLM = gemini-1.5-flash. Embedding Model = text-embedding-004. Embedding Dimension N = 768.
- OQ-9: Node >= 20. Express 5.3.0. Postgres image: pgvector/pgvector:pg16.
- Decisions (2026-10-10): Module system is ESM. Postgres vector index is HNSW. JWT lifetime is 24h. Fallback activated for embeddings: Since Docker and pgvector cannot be run locally, we will store embeddings as arrays and compute cosine similarity in Node for the small demo set.
- 2026-10-10 - D2-RAG tuning: Due to Docker absence locally, we used the plan's defaults (HIGH=0.80, MEDIUM=0.65). These should be verified when deployed or when DB is available.
- 2026-10-10 - D2-SHOP rule: When there are no candidates matching the budget and specs, the API returns an empty recommendations list and a generated clarifyingQuestion (e.g., "I couldn't find any products in that category under $X that meet all your requirements...") directly without calling the LLM again.


## Open questions (copy of the pack's section 1.3; mark each ANSWERED with the date)
- [x] OQ-1 Node/Express accepted by organizers
- [x] OQ-2 LLM + embedding provider, API key holder, embedding dimension N
- [ ] OQ-3 Demo local or deployed
- [ ] OQ-4 Scope sign-off and Profile page owner
- [x] OQ-5 How the UI reaches the intent router (2026-10-10: POST /assistant/chat endpoint approved and built)
- [x] OQ-6 Order-status tool shape and trigger (2026-10-10: tool deployed inside router)
- [ ] OQ-7 Laptop Return Policy preloaded or uploaded live
- [ ] OQ-8 Automated tests: yes or no
- [x] OQ-9 Versions (Node, Express, Postgres image tag)
- [ ] OQ-10 [PROPOSED] contract items signed off

## Contract changes
(date - what changed - who must adapt)

## Blockers
(phase - problem - what was tried)
- P0-A - Browser agent Playwright driver download fails (404 for playwright-1.57.0-win32_x64.zip); manual browser verification needed for full visual testing.
- P0-C - docker is not recognized - Cannot start Postgres for db:init and API verification.

## Packages added
(package - version - added by - phase)
- react - 19.3.0 - Dev A - P0-A (Vite template)
- react-dom - 19.3.0 - Dev A - P0-A (Vite template)
- react-router-dom - 7.18.4 - Dev A - P0-A
- tailwindcss - 4.3.3 - Dev A - P0-A
- @tailwindcss/vite - 4.3.3 - Dev A - P0-A
- @vitejs/plugin-react - (Vite template devDep) - Dev A - P0-A
- vite - 8.3.4 (devDep) - Dev A - P0-A
- express (5.3.0) - Dev C - P0-C
- cors (2.8.6) - Dev C - P0-C
- jsonwebtoken (9.0.3) - Dev C - P0-C
- bcrypt (6.0.0) - Dev C - P0-C
- zod (4.6.5) - Dev C - P0-C
- multer (2.4.0) - Dev C - P0-C
- pdf-parse (2.4.5) - Dev C - P0-C
- pg (8.23.1) - Dev C - P0-C
- pgvector (0.3.0) - Dev C - P0-C
- dotenv (18.0.7) - Dev C - P0-C
- pino (10.4.0) - Dev C - P0-C
- pdfkit (0.20.2) - Dev C - P0-C
- @google/generative-ai (0.24.1) - Dev D - P0-D

## Phase status (tick tasks inside each phase as you go)
- [ ] P0-ALL contract sign-off (all)
- [x] P0-A frontend scaffold (Dev A) — All 13 routes registered, build passes, dev server serves, mock system ready.
- [x] P0-B mocks and fixtures (Dev B) — All CONTRACT section 5 endpoints implemented with exact shapes, AI hero/vague and RAG responses verified, 54/54 checks passed, build passes.
- [x] P0-C backend scaffold and schema (Dev C)
- [x] P0-D pgvector and AI client spike (Dev D)
- [x] A1 UI kit, layout, login, Home, Products (Dev A) — Button/Input/Badge/Modal/Skeleton/EmptyState/Pagination/ErrorState, Header & Layout, Login with 4 quick-logins, Home with hero/categories/recommended/trending, Products with filter drawer & compare bar. Build passes.
- [x] B1 assistant UI on mocks (Dev B) — AssistantPanel, ChatMessage, RecommendationCard implemented. Browser verification skipped due to blocked environment.
- [x] C1 seed, auth, catalog APIs (Dev C)
- [x] D1 ingestion and documents API (Dev D)
- [ ] SYNC lunch sync (all)
- [x] A2 product detail, cart, wishlist (Dev A) — ProductDetail, Cart, Wishlist, CartContext, WishlistContext implemented. Build passes.
- [x] B2 knowledge base page (Dev B) — KnowledgePage, UploadZone, DocumentTable, MetadataForm implemented.
- [x] C2 cart, wishlist, preferences, orders APIs (Dev C)
- [x] D2-RAG /assistant/ask (Dev D)
- [x] D2-SHOP /assistant/shop (Dev D)
- [ ] INT-A / INT-B / INT-C / INT-D integration
- [ ] B3 compare, orders timeline, AI log (Dev B)
- [x] D3-ROUTER intent router and order-status tool (Dev D)
- [x] PX-PROFILE preferences page (owner per OQ-4) - Dev B
- [ ] QA bug bash (all)
- [ ] C3 demo data, reset, backup video (Dev C)
- [ ] D3-DOCS README, architecture diagram (Dev D)
- [ ] DEMO rehearsal (all)
- [ ] OPT-OPS optional ops dashboard / low-stock agent (only if ahead)

## Current focus per dev
A: A2 done, ready for INT-A   B: PX-PROFILE done, ready for QA   C: -   D: -

