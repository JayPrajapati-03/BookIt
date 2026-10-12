import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { User, type IUser } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { AuthService } from '../services/auth.service.js';
import { ROUTE_REGISTRY } from '../routes/routeRegistry.js';
import { hasPermission, type UserRole } from '@bookit/shared';

describe('Route × Role RBAC Matrix Test', () => {
  let replSet: MongoMemoryReplSet;
  const app = createApp();

  const users = {} as Record<UserRole, { user: IUser; token: string }>;

  beforeAll(async () => {
    replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    await mongoose.connect(replSet.getUri());

    const roles: UserRole[] = ['guest', 'staff', 'admin'];
    for (const role of roles) {
      const passwordHash = await AuthService.hashPassword('Password123!');
      const user = await User.create({
        name: `Test ${role}`,
        email: `${role}@bookit.test`,
        passwordHash,
        role,
        status: 'active',
      });
      const token = AuthService.generateAccessToken(user);
      users[role] = { user, token };
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await replSet.stop();
  });

  const rolesToTest: (UserRole | 'anonymous')[] = ['anonymous', 'guest', 'staff', 'admin'];

  for (const route of ROUTE_REGISTRY) {
    for (const role of rolesToTest) {
      it(`${route.method} ${route.path} as ${role}`, async () => {
        let req = (request(app) as unknown as Record<string, (url: string) => request.Test>)[
          route.method.toLowerCase()
        ](route.path);

        if (role !== 'anonymous') {
          req = req.set('Authorization', `Bearer ${users[role].token}`);
        }

        const res = await req;

        if (route.path === '/api/v1/auth/refresh') {
          // Refresh endpoint requires a valid refresh token cookie; returns 401 when absent
          expect(res.status).toBe(401);
        } else if (route.isPublic) {
          // Public routes should never return 401 or 403
          expect(res.status).not.toBe(401);
          expect(res.status).not.toBe(403);
        } else if (role === 'anonymous') {
          // Protected route accessed anonymously must return 401 Unauthorized
          expect(res.status).toBe(401);
        } else {
          const allowed = route.requiredPermission
            ? hasPermission(role, route.requiredPermission)
            : false;

          if (allowed) {
            // Authorized role should not get 401 or 403
            expect(res.status).not.toBe(401);
            expect(res.status).not.toBe(403);
          } else {
            // Denied role must get 403 Forbidden
            expect(res.status).toBe(403);
            expect(res.body.error.code).toBe('FORBIDDEN');

            // Verify AuditLog contains the denied action!
            const logEntry = await AuditLog.findOne({
              actor: users[role].user._id,
              action: `permission:${route.requiredPermission}`,
              outcome: 'denied',
            });
            expect(logEntry).not.toBeNull();
          }
        }
      });
    }
  }
});
