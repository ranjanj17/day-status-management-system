import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Day Status API', () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'daystatus@example.com', password: 'password123' });
    token = res.body.data.token;
  });

  it('should get empty statuses for a year', async () => {
    const res = await request(app).get('/api/day-status?year=2026');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('should prevent unauthenticated update', async () => {
    const res = await request(app)
      .put('/api/day-status/2026-01-01')
      .send({ status: 'Working' });
    expect(res.status).toBe(401);
  });

  it('should allow authenticated update', async () => {
    const res = await request(app)
      .put('/api/day-status/2026-01-01')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Working' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Working');
  });

  it('should fetch the updated status', async () => {
    const res = await request(app).get('/api/day-status/2026-01-01');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Working');
  });

  it('should reject invalid dates like 2026-02-29', async () => {
    const res = await request(app)
      .put('/api/day-status/2026-02-29')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Working' });
    
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should accept leap year date like 2024-02-29', async () => {
    const res = await request(app)
      .put('/api/day-status/2024-02-29')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Working' });
    
    expect(res.status).toBe(200);
  });

  it('should reject invalid dates like 2026-04-31', async () => {
    const res = await request(app)
      .put('/api/day-status/2026-04-31')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Working' });
    
    expect(res.status).toBe(400);
  });

  it('should handle concurrent updates (race conditions) correctly using optimistic locking', async () => {
    // 1. Initial write
    const res1 = await request(app)
      .put('/api/day-status/2026-05-15')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Initial Status' });
    
    expect(res1.status).toBe(200);
    const version = res1.body.data.version;
    expect(version).toBeDefined();

    // 2. Simulate two concurrent updates fetching the same version
    const requestA = request(app)
      .put('/api/day-status/2026-05-15')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Update A', version });

    const requestB = request(app)
      .put('/api/day-status/2026-05-15')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Update B', version });

    const [resA, resB] = await Promise.all([requestA, requestB]);

    // One should succeed (200) and the other should fail with 409 Conflict due to version mismatch
    const statuses = [resA.status, resB.status];
    expect(statuses).toContain(200);
    expect(statuses).toContain(409);
    
    // The successful one should increment the version
    const successfulRes = resA.status === 200 ? resA : resB;
    expect(successfulRes.body.data.version).toBe(version + 1);
  });
});
