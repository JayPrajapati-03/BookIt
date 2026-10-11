import request from 'supertest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { seedCatalogue } from './seed/seed.js';

export async function runSmokeTests() {
  console.log('🚀 Running BookIt Production Smoke Test Suite...');

  let replSet: MongoMemoryReplSet | null = null;
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      console.log('Checking connection to MongoDB...');
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    } catch {
      console.log('External MongoDB unreachable, using in-memory replica set for smoke tests...');
      replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
      await mongoose.connect(replSet.getUri());
    }
  } else {
    replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    await mongoose.connect(replSet.getUri());
  }

  await seedCatalogue();
  const app = createApp();

  const steps = [
    {
      name: '1. Health check (/healthz)',
      run: async () => {
        const res = await request(app).get('/healthz');
        if (res.status !== 200 || res.body.status !== 'ok') {
          throw new Error(`Expected 200 ok, got ${res.status}`);
        }
      },
    },
    {
      name: '2. Readiness check (/readyz)',
      run: async () => {
        const res = await request(app).get('/readyz');
        if (res.status !== 200 || res.body.status !== 'ready') {
          throw new Error(`Expected 200 ready, got ${res.status}`);
        }
      },
    },
    {
      name: '3. API ping (/api/v1/ping)',
      run: async () => {
        const res = await request(app).get('/api/v1/ping');
        if (res.status !== 200 || res.body.message !== 'pong') {
          throw new Error(`Expected 200 pong, got ${res.status}`);
        }
      },
    },
    {
      name: '4. Catalogue search (/api/v1/hotels)',
      run: async () => {
        const res = await request(app).get('/api/v1/hotels?limit=5');
        const hotels = Array.isArray(res.body.data) ? res.body.data : res.body.data?.hotels;
        if (res.status !== 200 || !Array.isArray(hotels)) {
          throw new Error(`Expected hotels array, got ${res.status}`);
        }
      },
    },
    {
      name: '5. Demo guest login (/api/v1/auth/login)',
      run: async () => {
        const res = await request(app).post('/api/v1/auth/login').send({
          email: 'demo_guest@bookit.internal',
          password: 'Password123!',
        });
        if (res.status !== 200 || !res.body.data.accessToken) {
          throw new Error(`Expected 200 with accessToken, got ${res.status}`);
        }
      },
    },
    {
      name: '6. Demo admin login & dashboard access (/api/v1/admin/dashboard)',
      run: async () => {
        const authRes = await request(app).post('/api/v1/auth/login').send({
          email: 'demo_admin@bookit.internal',
          password: 'Password123!',
        });
        const token = authRes.body.data.accessToken;
        const dashRes = await request(app)
          .get('/api/v1/admin/dashboard')
          .set('Authorization', `Bearer ${token}`);
        if (dashRes.status !== 200 || !dashRes.body.data.kpis) {
          throw new Error(`Expected 200 with kpis, got ${dashRes.status}`);
        }
      },
    },
    {
      name: '7. RBAC security barrier (guest accessing /admin/dashboard)',
      run: async () => {
        const authRes = await request(app).post('/api/v1/auth/login').send({
          email: 'demo_guest@bookit.internal',
          password: 'Password123!',
        });
        const token = authRes.body.data.accessToken;
        const dashRes = await request(app)
          .get('/api/v1/admin/dashboard')
          .set('Authorization', `Bearer ${token}`);
        if (dashRes.status !== 403) {
          throw new Error(
            `Expected 403 Forbidden for guest on admin dashboard, got ${dashRes.status}`,
          );
        }
      },
    },
  ];

  for (const step of steps) {
    process.stdout.write(`  ⏳ ${step.name}... `);
    try {
      await step.run();
      console.log('✅ PASS');
    } catch (err: any) {
      console.log(`❌ FAIL (${err.message})`);
      process.exit(1);
    }
  }

  console.log('\n🎉 All smoke tests passed successfully! System is fully functional.\n');

  await mongoose.disconnect();
  if (replSet) await replSet.stop();
  process.exit(0);
}

if (process.argv[1]?.includes('smoke')) {
  runSmokeTests().catch((err) => {
    console.error('Smoke tests failed:', err);
    process.exit(1);
  });
}
