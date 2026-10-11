import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Health & Security Endpoints', () => {
  const app = createApp();

  it('GET /healthz returns 200 with uptime', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('uptime');
  });

  it('GET /api/v1/ping returns 200 with pong', async () => {
    const res = await request(app).get('/api/v1/ping');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'pong');
  });

  it('GET /unknown-route returns 404 with standardized error envelope', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('code', 'NOT_FOUND');
    expect(res.body.error).toHaveProperty('message');
    expect(res.body.error).toHaveProperty('requestId');
    expect(res.headers).toHaveProperty('x-request-id');
  });

  it('Rejects requests with NoSQL operators in query params', async () => {
    const res = await request(app).get('/api/v1/ping?$where=sleep(100)');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /docs returns 200 interactive Swagger documentation', async () => {
    const res = await request(app).get('/docs');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('SwaggerUIBundle');
  });
});
