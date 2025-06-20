// Auth endpoint tests (ES Modules, Jest)
import request from 'supertest';
import app from '../src/server.js';

describe('Auth Endpoints', () => {
  const user = { name: 'Test User', email: 'test@example.com', password: 'password123' };
  let token;

  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(user);
    await new Promise(res => setTimeout(res, 100));
    const login = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
    token = login.body.token;
  });

  afterEach(async () => {
    // Clean up users after each test
    const User = (await import('../src/models/User.js')).default;
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    // Already registered in beforeEach
    expect(token).toBeDefined();
  });

  it('should not register duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.statusCode).toBe(409);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });

  it('should get current user profile', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(user.email);
  });

  it('should update user profile', async () => {
    const res = await request(app).put('/api/auth/me').set('Authorization', `Bearer ${token}`).send({ name: 'Updated User' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated User');
  });
});
