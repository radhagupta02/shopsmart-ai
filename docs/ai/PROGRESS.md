# PROGRESS (update after every task)

## Decisions
(date - decision - why)  Record here: OQ answers, provider + embedding dimension, Node/Express versions, JWT lifetime, final confidence thresholds, signed-off [PROPOSED] items.
- 2026-10-10 - Node v22.19.0, npm 10.9.3 confirmed on dev machine.

## Open questions (copy of the pack's section 1.3; mark each ANSWERED with the date)
- [ ] OQ-1 Node/Express accepted by organizers
- [ ] OQ-2 LLM + embedding provider, API key holder, embedding dimension N
- [ ] OQ-3 Demo local or deployed
- [ ] OQ-4 Scope sign-off and Profile page owner
- [ ] OQ-5 How the UI reaches the intent router
- [ ] OQ-6 Order-status tool shape and trigger
- [ ] OQ-7 Laptop Return Policy preloaded or uploaded live
- [ ] OQ-8 Automated tests: yes or no
- [ ] OQ-9 Versions (Node, Express, Postgres image tag)
- [ ] OQ-10 [PROPOSED] contract items signed off

## Contract changes
(date - what changed - who must adapt)

## Blockers
(phase - problem - what was tried)
- P0-A - Browser agent Playwright driver download fails (404 for playwright-1.57.0-win32_x64.zip); manual browser verification needed for full visual testing.

## Packages added
(package - version - added by - phase)
- react - 19.3.0 - Dev A - P0-A (Vite template)
- react-dom - 19.3.0 - Dev A - P0-A (Vite template)
- react-router-dom - 7.18.4 - Dev A - P0-A
- tailwindcss - 4.3.3 - Dev A - P0-A
- @tailwindcss/vite - 4.3.3 - Dev A - P0-A
- @vitejs/plugin-react - (Vite template devDep) - Dev A - P0-A
- vite - 8.3.4 (devDep) - Dev A - P0-A

## Phase status (tick tasks inside each phase as you go)
- [ ] P0-ALL contract sign-off (all)
- [x] P0-A frontend scaffold (Dev A) — All 13 routes registered, build passes, dev server serves, mock system ready.
- [x] P0-B mocks and fixtures (Dev B) — All CONTRACT section 5 endpoints implemented with exact shapes, AI hero/vague and RAG responses verified, 54/54 checks passed, build passes.
- [ ] P0-C backend scaffold and schema (Dev C)
- [ ] P0-D pgvector and AI client spike (Dev D)
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
A: P0-A done, ready for A1   B: P0-B done, ready for B1   C: -   D: -

