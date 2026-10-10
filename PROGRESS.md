# BookIt — Implementation Progress

Status: In Progress
Total Phases: 10 (Phase 0 to Phase 9)

## Phase Checklist

- [x] **Phase 0 — Foundation**
  - [x] Git repository & pnpm workspaces initialized
  - [x] Shared package (`@bookit/shared`) with Zod schemas, types, permissions, socket events, error codes
  - [x] API workspace (`apps/api`) with Express 5, TypeScript, Pino logger, health endpoints (`/healthz`, `/readyz`), env validation
  - [x] Web workspace (`apps/web`) with React 19, Vite, TypeScript, React Router, CSS tokens, base component library
  - [x] Component preview page (`/_ui`) showing all components in all design states
  - [x] Docker compose replica set & Mailpit config (`infra/docker-compose.yml`)
  - [x] Root scripts: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm dev`
  - [x] CI workflow (`.github/workflows/ci.yml`)
  - [x] Documentation: `docs/DESIGN.md`, `DECISIONS.md`, `PROGRESS.md`
  - *Acceptance Evidence:*
    - `pnpm typecheck`: 0 errors across `@bookit/shared`, `@bookit/api`, `@bookit/web`
    - `pnpm lint`: Clean (0 errors, 0 warnings)
    - `pnpm test`: 4/4 health & security tests passed in `@bookit/api`
    - `pnpm build`: Built shared (tsc), api (tsc), web (vite 1.87s bundle)
    - `/_ui`: Renders palette swatches, Button/Field/Badge/Skeleton/EmptyState/Dialog/Drawer in all states.

- [x] **Phase 1 — Auth & RBAC**
  - [x] Models: `User`, `RefreshToken`, `AuditLog` with strict indexes and TTL
  - [x] Argon2id password hashing, constant-time comparisons, progressive account lockout
  - [x] Access JWT (15m) + rotating refresh token cookie (family tracking + reuse revocation)
  - [x] Permission map (`@bookit/shared`), `authenticate` & `authorize` middleware
  - [x] Route registry & automated route × role authorization matrix test (96 cases)
  - [x] Audit logging for denials and sensitive actions
  - [x] Rate limiting on `/api/v1/auth/*`
  - [x] Auth UI with 1-click reviewer demo accounts (`/login`, `/register`)
  - *Acceptance Evidence:*
    - Refresh-reuse test: Presenting an already-replaced refresh token immediately revokes all tokens in the family and writes an audit log with `outcome: "denied"`.
    - Route × Role matrix test: Iterates all 24 route definitions across all 4 roles (anonymous, guest, staff, admin) = 96 tests, all asserting exact 401/403/200 codes.
    - Zero unauthorized access: Every denied request writes an `AuditLog` entry.
    - Full quality gates: `pnpm typecheck`, `pnpm lint`, `pnpm test` (103/103 passed), `pnpm build` all green.

- [ ] **Phase 2 — Catalogue & Search**
  - [ ] Models: `Hotel`, `RoomType`, `Room` with indexes
  - [ ] Catalogue seed generator
  - [ ] Search API with filters, facets (`$facet`), geo (`$nearSphere`), sorting, cursor pagination
  - [ ] Cloudinary upload integration
  - [ ] Frontend: Home (sentence-style search + "Open tonight" strip), `/search` (list + Leaflet map), `/hotels/:slug`
  - *Acceptance Criteria:* URL-synced search, `explain()` index coverage verified, map and list consistency.

- [ ] **Phase 3 — Pricing & Availability Engine**
  - [ ] `PricingRule` model & quote service with deterministic priority
  - [ ] `RoomNight` ledger model with unique `{ room: 1, date: 1 }`
  - [ ] Availability aggregation over stay dates
  - [ ] Month calendar endpoint + frontend calendar with live units and rates
  - *Acceptance Criteria:* Pricing rule unit tests, month boundary tests, calendar matches DB.

- [ ] **Phase 4 — Booking Flow & Concurrency**
  - [ ] Mongo transaction hold endpoint (`POST /bookings/hold`) with idempotency key
  - [ ] Confirm endpoint (`POST /bookings/:id/confirm`) with policy snapshot
  - [ ] Cancel endpoint (`POST /bookings/:id/cancel`) with penalty/refund calculation
  - [ ] Hold sweeper background job
  - [ ] Checkout flow with countdown timer & receipt generation
  - *Acceptance Criteria:* 5 concurrency invariants pass 20x consecutively without flake.

- [ ] **Phase 5 — Realtime (Socket.io)**
  - [ ] Authenticated Socket.io server with handshake auth & server-derived rooms
  - [ ] Real-time availability updates (`availability:changed`)
  - [ ] Real room presence (`hotel:viewers`)
  - [ ] User notifications & booking status updates
  - [ ] Client socket provider with reconnect, resync, and UI status indicator
  - *Acceptance Criteria:* Playwright two-context test passes without reload; kill & reconnect resyncs cleanly.

- [ ] **Phase 6 — Guest Area**
  - [ ] Booking history with status filters, search by reference, cursor pagination
  - [ ] Booking detail timeline & cancellation
  - [ ] Wishlist with optimistic toggles
  - [ ] Review system restricted to verified checked-out stays
  - [ ] Profile, security, active sessions management
  - *Acceptance Criteria:* Guest full lifecycle verified; cross-user booking access returns 404/403.

- [ ] **Phase 7 — Admin Panel**
  - [ ] Overview dashboard: live KPIs (Occupancy, ADR, RevPAR), arrivals/departures, live activity feed
  - [ ] Front-desk Tape Chart with live real-time booking bars, walk-in creation, room drag/move
  - [ ] Bookings table with TanStack Table, filters, CSV export
  - [ ] Properties, Room Types, Rooms & Pricing Rules management
  - [ ] Maintenance room blocks
  - [ ] Staff management (admin only, last-admin protected), Audit log viewer, Reports
  - *Acceptance Criteria:* Walk-in booking on tape chart reflects immediately on guest view; staff receives 403 on admin-only routes.

- [ ] **Phase 8 — Performance, Hardening, Accessibility**
  - [ ] Database benchmark script (`tools/benchmark`) with 100k+ docs, measuring `docsExamined` & execution time
  - [ ] `docs/PERFORMANCE.md` with measured numbers
  - [ ] Locust load testing (`tools/loadtest/locustfile.py`)
  - [ ] WCAG AA accessibility audit (keyboard navigation, focus-visible, screen-reader attributes)
  - [ ] Mobile testing (360px+)
  - *Acceptance Criteria:* Verified 0 double-bookings under load; documented benchmark proof.

- [ ] **Phase 9 — Deploy & Documentation**
  - [ ] `infra/render.yaml`, `infra/Dockerfile.api`, `apps/web/vercel.json`
  - [ ] Production seed script (`DEMO_MODE=true`)
  - [ ] OpenAPI documentation at `/docs` & exported Postman collection
  - [ ] Production smoke test script (`tools/smoke.ts`)
  - [ ] Comprehensive `README.md`, `DEPLOYMENT.md`, `docs/ARCHITECTURE.md`
  - *Acceptance Criteria:* End-to-end verified workflow against deployed architecture.
