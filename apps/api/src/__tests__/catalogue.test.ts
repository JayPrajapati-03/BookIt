import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { seedCatalogue } from '../seed/seed.js';
import { Hotel } from '../models/Hotel.js';

describe('Catalogue & Search Engine with Index Verification', () => {
  let replSet: MongoMemoryReplSet;
  const app = createApp();

  beforeAll(async () => {
    replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    await mongoose.connect(replSet.getUri());
    // Seed catalogue
    await seedCatalogue(replSet.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await replSet.stop();
  });

  it('GET /api/v1/hotels returns published properties with facet aggregates', async () => {
    const res = await request(app).get('/api/v1/hotels');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.meta).toHaveProperty('total');
    expect(res.body.meta.facets).toHaveProperty('propertyTypes');
    expect(res.body.meta.facets).toHaveProperty('amenities');
    expect(res.body.meta.facets).toHaveProperty('priceRange');
  });

  it('Filters by city accurately', async () => {
    const res = await request(app).get('/api/v1/hotels?city=Udaipur');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    for (const h of res.body.data) {
      expect(h.city).toBe('Udaipur');
    }
  });

  it('Filters by propertyType and price range', async () => {
    const res = await request(app).get(
      '/api/v1/hotels?propertyType=haveli&minPrice=500000&maxPrice=1000000',
    );
    expect(res.status).toBe(200);
    for (const h of res.body.data) {
      expect(h.propertyType).toBe('haveli');
      expect(h.fromPricePaise).toBeGreaterThanOrEqual(500000);
      expect(h.fromPricePaise).toBeLessThanOrEqual(1000000);
    }
  });

  it('Autosuggest returns matching cities and properties', async () => {
    const res = await request(app).get('/api/v1/hotels/suggest?q=Uda');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    const hasUdaipur = res.body.data.some((s: any) => s.value === 'Udaipur');
    expect(hasUdaipur).toBe(true);
  });

  it('GET /api/v1/hotels/:slug returns property and active room types', async () => {
    const res = await request(app).get('/api/v1/hotels/rawla-fateh-heritage-haveli-udaipur');
    expect(res.status).toBe(200);
    expect(res.body.data.hotel.name).toBe('Rawla Fateh Heritage Haveli');
    expect(res.body.data.roomTypes.length).toBeGreaterThan(0);
    expect(res.body.data.roomTypes[0]).toHaveProperty('basePricePaise');
  });

  it('Verifies explain("executionStats") uses the designed index (IXSCAN)', async () => {
    // Check index utilization on { status: 1, city: 1, fromPricePaise: 1 }
    const explainResult: any = await Hotel.find({
      status: 'published',
      city: 'Udaipur',
      fromPricePaise: { $gte: 500000 },
    }).explain('executionStats');

    const winningPlan =
      explainResult.queryPlanner?.winningPlan?.inputStage ||
      explainResult.queryPlanner?.winningPlan;

    // Must be an index scan (IXSCAN), not a collection scan (COLLSCAN)
    expect(winningPlan.stage).toBe('IXSCAN');
    expect(winningPlan.keyPattern).toHaveProperty('status');
    expect(winningPlan.keyPattern).toHaveProperty('city');
    expect(winningPlan.keyPattern).toHaveProperty('fromPricePaise');
  });
});
