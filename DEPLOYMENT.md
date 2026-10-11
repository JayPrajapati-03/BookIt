# BookIt — Production Deployment Guide

This guide details deployment of the BookIt monorepo to production platforms (Render for API + MongoDB Atlas, Vercel for Web).

---

## 1. Infrastructure Architecture

- **Web Frontend**: Vercel / Netlify / Cloudflare Pages (Static SPA with Vite + React 19)
- **API Backend**: Render Web Service / Fly.io / AWS ECS (Node.js 22 LTS container)
- **Database**: MongoDB Atlas 7.0+ (M10+ recommended for production transactions)
- **Email / Notifications**: SendGrid / Resend (or Mailpit for staging)

---

## 2. Environment Configuration

### Backend Environment Variables (`apps/api/.env`)

```ini
NODE_ENV=production
PORT=4000
API_URL=https://api.bookit.example.com
WEB_URL=https://bookit.example.com
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/bookit?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your-secure-random-64-character-access-secret
JWT_REFRESH_SECRET=your-secure-random-64-character-refresh-secret
COOKIE_DOMAIN=.example.com
COOKIE_SECURE=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
LOG_LEVEL=info
DEMO_MODE=true
```

### Frontend Environment Variables (`apps/web/.env`)

```ini
VITE_API_URL=https://api.bookit.example.com/api/v1
VITE_SOCKET_URL=https://api.bookit.example.com
```

---

## 3. Docker Deployment (Backend)

Build and run using the production Dockerfile:

```bash
docker build -f infra/Dockerfile.api -t bookit-api:latest .
docker run -p 4000:4000 --env-file .env bookit-api:latest
```

The Dockerfile is multi-stage:

- Builds shared packages and TypeScript definitions.
- Prunes development dependencies.
- Employs an unprivileged `node` user for defense-in-depth container security.

---

## 4. Database Seeding & Initialization

Once MongoDB Atlas is configured, seed the baseline boutique property catalogue:

```bash
pnpm seed
```

Verify system health and index utilization:

```bash
pnpm benchmark
pnpm smoke
```
