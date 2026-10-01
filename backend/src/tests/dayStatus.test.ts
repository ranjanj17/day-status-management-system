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
});
