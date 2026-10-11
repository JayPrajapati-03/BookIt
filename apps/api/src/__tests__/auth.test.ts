import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { AuditLog } from '../models/AuditLog.js';

describe('Auth & Refresh Token Rotation with Reuse Detection', () => {
  let replSet: MongoMemoryReplSet;
  const app = createApp();

  beforeAll(async () => {
    replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    await mongoose.connect(replSet.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await replSet.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await RefreshToken.deleteMany({});
    await AuditLog.deleteMany({});
  });

  it('Registers a new user and issues access token + refresh cookie', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Aditi Sharma',
      email: 'aditi@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data.user).toMatchObject({
      name: 'Aditi Sharma',
      email: 'aditi@example.com',
      role: 'guest',
    });
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toContain('refreshToken=');
  });

  it('Logs in user and rejects invalid password without account enumeration', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Aditi Sharma',
      email: 'aditi@example.com',
      password: 'Password123!',
    });

    // Wrong password
    const failRes = await request(app).post('/api/v1/auth/login').send({
      email: 'aditi@example.com',
      password: 'WrongPassword!',
    });

    expect(failRes.status).toBe(401);
    expect(failRes.body.error.message).toBe('Email or password is incorrect');

    // Correct password
    const okRes = await request(app).post('/api/v1/auth/login').send({
      email: 'aditi@example.com',
      password: 'Password123!',
    });

    expect(okRes.status).toBe(200);
    expect(okRes.body.data).toHaveProperty('accessToken');
  });

  it('Rotates refresh token and REVOKES THE WHOLE FAMILY on reuse detection', async () => {
    const registerRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Vikram Mehta',
      email: 'vikram@example.com',
      password: 'Password123!',
    });

    const cookieHeader = registerRes.headers['set-cookie'][0];
    const initialToken = cookieHeader.split(';')[0].split('=')[1];

    // First rotation: legitimate refresh
    const refreshRes1 = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', [`refreshToken=${initialToken}`]);

    expect(refreshRes1.status).toBe(200);
    expect(refreshRes1.body.data).toHaveProperty('accessToken');
    const newCookieHeader = refreshRes1.headers['set-cookie'][0];
    const secondToken = newCookieHeader.split(';')[0].split('=')[1];
    expect(secondToken).not.toBe(initialToken);

    // REUSE ATTACK: Attacker presents the old initialToken!
    const reuseRes = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', [`refreshToken=${initialToken}`]);

    expect(reuseRes.status).toBe(401);
    expect(reuseRes.body.error.message).toContain('Refresh token reuse detected');

    // Verification: Now even the legitimate secondToken must be revoked!
    const subsequentRes = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', [`refreshToken=${secondToken}`]);

    expect(subsequentRes.status).toBe(401);

    // Verification: Audit log contains reuse event
    const auditEntry = await AuditLog.findOne({ action: 'auth:refresh_reuse_detected' });
    expect(auditEntry).not.toBeNull();
    expect(auditEntry?.outcome).toBe('denied');
  });
});
