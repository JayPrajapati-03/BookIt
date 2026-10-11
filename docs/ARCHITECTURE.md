# BookIt — System Architecture & Engineering Specifications

## 1. High-Level Architecture Overview

BookIt is architected as an enterprise-grade, monorepo web platform engineered for real-time boutique hotel discovery, inventory booking, and hospitality operations.

```
┌─────────────────────────────────────────────────────────────┐
│                    React 19 Web SPA (Vite)                   │
│  - Redux Toolkit + RTK Query / Axios Client                 │
│  - Custom Design System (Vanilla CSS Design Tokens)         │
│  - Real-time Socket.io presence & notification client       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / WSS
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express 5 API Service                     │
│  - Security: Helmet, CORS, Rate Limiters, HPP               │
│  - Auth: Argon2id, JWT Access + Rotating Refresh Tokens     │
│  - Core Services: Search, Pricing Engine, Booking Ledger     │
│  - Real-time: Authenticated Socket.io Server (Rooms/Push)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM / Transactions
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB 7.0+ Replica Set                  │
│  - ACID Multi-Document Transactions for Booking Ledger       │
│  - Geospatial 2dsphere Indexes & Compound Fast Indices      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Domain Data Model & Entity Relationships

```
┌──────────────┐          ┌────────────────┐          ┌──────────────┐
│    Hotel     │1       * │    RoomType    │1       * │     Room     │
│──────────────│──────────│────────────────│──────────│──────────────│
│ slug (UQ)    │          │ slug           │          │ number (UQ)  │
│ location 2D  │          │ basePricePaise │          │ floor        │
│ policies     │          │ unitCount      │          │ status       │
└──────────────┘          └────────────────┘          └──────────────┘
       ▲                                                     ▲
       │                                                     │
       │                                                     │
┌──────────────┐          ┌────────────────┐                 │
│  PricingRule │          │   RoomNight    │*                │
│──────────────│          │────────────────│─────────────────┘
│ multiplier   │          │ date (YYYYMMDD)│
│ priority     │          │ status (occ)   │
└──────────────┘          └────────────────┘
                                  ▲
                                  │ *
┌──────────────┐          ┌────────────────┐
│     User     │1       * │    Booking     │
│──────────────│──────────│────────────────│
│ role (RBAC)  │          │ reference (UQ) │
│ tokenFamily  │          │ holdExpiresAt  │
└──────────────┘          │ status         │
                          │ idempotencyKey │
                          └────────────────┘
```

---

## 3. Concurrency & Inventory Ledger Model

Unlike naive booking implementations that store single room counter numbers (e.g. `availableRooms: 5`), BookIt models room availability as a **discrete per-night ledger**:

- Every room reservation inserts records into the `RoomNight` collection with compound unique index `{ room: 1, date: 1 }`.
- When requesting availability for dates `[checkIn, checkOut)`, the pricing engine executes an aggregation matching unreserved rooms in the target `roomType`.
- When placing a hold:
  1. A MongoDB session starts a multi-document ACID transaction.
  2. The system checks available inventory for the date range.
  3. A temporary hold booking is generated with a 15-minute countdown.
  4. Room nights are atomically written. Any concurrent collision immediately aborts the transaction with `SOLD_OUT`.

---

## 4. Role-Based Access Control (RBAC)

The system enforces strict principle-of-least-privilege with four user tiers:

1. **Anonymous**: Public catalogue discovery, autosuggest, availability quotes, authentication.
2. **Guest**: Personal bookings management, checkout, personal wishlist, stay reviews, profile management.
3. **Staff**: Front-desk tape chart operations, walk-in creation, booking check-in/check-out lifecycle updates, room maintenance blocks.
4. **Admin**: Platform settings, property catalogue management, dynamic pricing rule orchestration, staff role assignment, system audit logs, occupancy and revenue analytics.

Each HTTP endpoint and WebSocket room verifies exact permissions via the `@bookit/shared` authorization matrix.
