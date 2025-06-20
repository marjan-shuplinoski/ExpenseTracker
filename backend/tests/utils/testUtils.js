import request from 'supertest';
import app from '../../src/server.js';

// Utility for test token (ES Modules)
export async function getTestToken() {
  // Register and login a real user, return the JWT
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'Test1234!';
  await request(app).post('/api/auth/register').send({ email, password, name: 'Test User' });
  const login = await request(app).post('/api/auth/login').send({ email, password });
  return login.body.token;
}
