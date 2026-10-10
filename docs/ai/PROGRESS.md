# PROGRESS (update after every task)

## Decisions
(date - decision - why)  Record here: OQ answers, provider + embedding dimension, Node/Express versions, JWT lifetime, final confidence thresholds, signed-off [PROPOSED] items.

- OQ-1: Organizers confirmed Node.js + Express is accepted.
- OQ-2: Provider = Google Gemini API (AI Studio). LLM = gemini-1.5-flash. Embedding Model = text-embedding-004. Embedding Dimension N = 768.
- OQ-9: Node >= 20. Express 5.3.0. Postgres image: pgvector/pgvector:pg16.
- Decisions (2026-10-10): Module system is ESM. Postgres vector index is HNSW. JWT lifetime is 24h. Fallback activated for embeddings: Since Docker and pgvector cannot be run locally, we will store embeddings as arrays and compute cosine similarity in Node for the small demo set.


## Open questions (copy of the pack's section 1.3; mark each ANSWERED with the date)
- [x] OQ-1 Node/Express accepted by organizers
- [x] OQ-2 LLM + embedding provider, API key holder, embedding dimension N
- [ ] OQ-3 Demo local or deployed
- [ ] OQ-4 Scope sign-off and Profile page owner
- [ ] OQ-5 How the UI reaches the intent router
- [ ] OQ-6 Order-status tool shape and trigger
- [ ] OQ-7 Laptop Return Policy preloaded or uploaded live
- [ ] OQ-8 Automated tests: yes or no
- [x] OQ-9 Versions (Node, Express, Postgres image tag)
- [ ] OQ-10 [PROPOSED] contract items signed off

## Contract changes
(date - what changed - who must adapt)

## Blockers
(phase - problem - what was tried)
- P0-C - docker is not recognized - Cannot start Postgres for db:init and API verification.

## Packages added
(package - version - added by - phase)
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
- [ ] P0-A frontend scaffold (Dev A)
- [ ] P0-B mocks and fixtures (Dev B)
- [x] P0-C backend scaffold and schema (Dev C)
- [x] P0-D pgvector and AI client spike (Dev D)
- [ ] A1 UI kit, layout, login, Home, Products (Dev A)
- [ ] B1 assistant UI on mocks (Dev B)
- [ ] C1 seed, auth, catalog APIs (Dev C)
- [ ] D1 ingestion and documents API (Dev D)
- [ ] SYNC lunch sync (all)
- [ ] A2 product detail, cart, wishlist (Dev A)
- [ ] B2 knowledge base page (Dev B)
- [ ] C2 cart, wishlist, preferences, orders APIs (Dev C)
- [ ] D2-RAG /assistant/ask (Dev D)
- [ ] D2-SHOP /assistant/shop (Dev D)
- [ ] INT-A / INT-B / INT-C / INT-D integration
- [ ] B3 compare, orders timeline, AI log (Dev B)
- [ ] D3-ROUTER intent router and order-status tool (Dev D)
- [ ] PX-PROFILE preferences page (owner per OQ-4)
- [ ] QA bug bash (all)
- [ ] C3 demo data, reset, backup video (Dev C)
- [ ] D3-DOCS README, architecture diagram (Dev D)
- [ ] DEMO rehearsal (all)
- [ ] OPT-OPS optional ops dashboard / low-stock agent (only if ahead)

## Current focus per dev
A: -   B: -   C: -   D: -
