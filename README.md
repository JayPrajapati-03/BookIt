# BookIt — Real-Time Boutique Hotel Booking Platform

[![CI](https://github.com/bookit/bookit/actions/workflows/ci.yml/badge.svg)](https://github.com/bookit/bookit/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.0-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0%2B-green.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **BookIt** is a portfolio-grade, production-quality full-stack hospitality platform built to demonstrate high-concurrency booking mechanics, sub-millisecond database indexing, real-time presence, and modern design standards.

---

## 🌟 Highlights & Key Features

- **Double-Booking Prevention via ACID Transactions**: Discrete room-night inventory ledger with MongoDB multi-document transactions and compound uniqueness constraints. Zero overselling guarantee.
- **Strict Idempotency**: All hold and checkout operations accept unique `Idempotency-Key` headers for safe network retries.
- **Enterprise RBAC**: Four-tier permission matrix (Anonymous, Guest, Staff, Admin) backed by Argon2id, rotating refresh tokens with automatic token family reuse revocation, and complete audit logging.
- **Real-Time Operational Front Desk**:
  - Live front-desk **Tape Chart** with dynamic multi-day calendar visualization, room occupancy bars, and status transitions.
  - WebSocket presence tracking (`hotel:viewers`) and push notifications for status updates.
- **Rich Aesthetic Design System**:
  - Hand-crafted design token system built on modern Vanilla CSS with HSL color palettes and dark mode support.
  - Interactive Sentence Search, "Open Tonight" discovery strip, live pricing calendars, and responsive mobile-first layouts.
  - Component design sandbox accessible at `/_ui`.

---

## 🏗 Repository Architecture

BookIt is organized as an optimized `pnpm` monorepo:

```
BookIt/
├── apps/
│   ├── api/            # Express 5, TypeScript, Mongoose 8, Pino, Socket.io
│   │   ├── src/controllers/
│   │   ├── src/models/
│   │   ├── src/services/
│   │   └── src/__tests__/  # 113 unit, matrix, and concurrency tests
│   └── web/            # React 19, Vite, Redux Toolkit, React Router 7
│       ├── src/components/
│       ├── src/pages/      # Search, HotelDetail, Checkout, Guest & Admin
│       └── src/services/   # Axios client with auto-refresh & WebSockets
├── packages/
│   └── shared/         # Zod schemas, TypeScript types, RBAC permissions
├── tools/
│   ├── benchmark/      # Database execution plan & index verification
│   ├── loadtest/       # Locust load test scripts
│   ├── seed/           # Boutique property catalogue generator
│   └── smoke.ts        # End-to-end production smoke test
├── infra/              # Dockerfile, Docker Compose (replica set), Render config
└── docs/               # System architecture, design system, performance audits
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js `22.x` or `24.x`
- `pnpm` `9.x` or `10.x`
- Docker (for local MongoDB replica set)

### 1. Installation

```bash
git clone https://github.com/your-username/BookIt.git
cd BookIt
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

### 3. Start Database & Mailpit

```bash
docker compose -f infra/docker-compose.yml up -d
```

### 4. Seed Catalogue Data

```bash
pnpm seed
```

### 5. Launch Development Servers

```bash
pnpm dev
```

- **Web Application**: [http://localhost:5173](http://localhost:5173)
- **API Server**: [http://localhost:4000](http://localhost:4000)
- **Component Design System**: [http://localhost:5173/_ui](http://localhost:5173/_ui)
- **Mailpit Web UI**: [http://localhost:8025](http://localhost:8025)

---

## 👤 Reviewer Demo Accounts

One-click reviewer login buttons are embedded directly into `/login` when running in demo mode:

| Role      | Email                        | Password       | Access Scope                                                          |
| :-------- | :--------------------------- | :------------- | :-------------------------------------------------------------------- |
| **Guest** | `demo_guest@bookit.internal` | `Password123!` | Discovery, quotes, reservations, checkout, wishlists, reviews         |
| **Staff** | `demo_staff@bookit.internal` | `Password123!` | Tape chart, walk-in bookings, check-in/out, maintenance room blocks   |
| **Admin** | `demo_admin@bookit.internal` | `Password123!` | Full access: KPIs, properties, pricing rules, staff roles, audit logs |

---

## 🧪 Testing & Verification

### Run Vitest Test Suite (113 Tests)

Includes Route × Role RBAC Matrix (96 cases), auth rotation, search facets, health checks, and concurrency invariants:

```bash
pnpm test
```

### Run Concurrency Invariant Tests

```bash
pnpm --filter @bookit/api test src/__tests__/concurrency.test.ts
```

### Run Database Performance Benchmark (explain plans & index checks)

```bash
pnpm benchmark
```

### Run Production Smoke Test

```bash
pnpm smoke
```

### Run Quality Gates

```bash
pnpm typecheck
pnpm lint
pnpm format
pnpm build
```

---

## 📖 In-Depth Documentation

- [System Architecture & Data Modeling](docs/ARCHITECTURE.md)
- [Design Tokens & UI Component System](docs/DESIGN.md)
- [Performance Benchmarks & Query Optimization](docs/PERFORMANCE.md)
- [Production Deployment Guide](DEPLOYMENT.md)
- [Architecture Decision Records (ADRs)](DECISIONS.md)

---

## 📄 License

MIT © BookIt Contributors
