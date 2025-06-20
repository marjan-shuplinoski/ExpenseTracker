// Jest tests for Reports & Export endpoints (ES Modules)
import request from 'supertest';
import app from '../src/server.js';
import { getTestToken } from './utils/testUtils.js';

describe('Reports & Export API', () => {
  let token;
  beforeAll(async () => {
    token = await getTestToken();
  });

  describe('GET /api/reports/summary', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/api/reports/summary');
      expect(res.statusCode).toBe(401);
    });
    it('should validate query params', async () => {
      const res = await request(app)
        .get('/api/reports/summary')
        .set('Authorization', `Bearer ${token}`)
        .query({ start: 'invalid', end: 'invalid' });
      expect(res.statusCode).toBe(400);
    });
    it('should return summary data', async () => {
      const res = await request(app)
        .get('/api/reports/summary')
        .set('Authorization', `Bearer ${token}`)
        .query({ start: '2025-01-01', end: '2025-12-31' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('GET /api/reports/monthly', () => {
    it('should return monthly data', async () => {
      const res = await request(app)
        .get('/api/reports/monthly')
        .set('Authorization', `Bearer ${token}`)
        .query({ start: '2025-01-01', end: '2025-12-31' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('GET /api/reports/yearly', () => {
    it('should return yearly data', async () => {
      const res = await request(app)
        .get('/api/reports/yearly')
        .set('Authorization', `Bearer ${token}`)
        .query({ start: '2020-01-01', end: '2025-12-31' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('GET /api/reports/export', () => {
    it('should return a CSV file', async () => {
      const res = await request(app)
        .get('/api/reports/export')
        .set('Authorization', `Bearer ${token}`)
        .query({ format: 'csv' });
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/text\/csv/);
    });
    it('should reject invalid format', async () => {
      const res = await request(app)
        .get('/api/reports/export')
        .set('Authorization', `Bearer ${token}`)
        .query({ format: 'pdf' });
      expect(res.statusCode).toBe(400);
    });
  });
});
