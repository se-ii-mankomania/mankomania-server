const request = require('supertest');
const app = require('../server').app;
const closeServer = require('../server').closeServer;
const User = require('../models/user');



jest.mock('../models/user');

describe('Authentication endpoints', () => {
  test('register - success', async () => {

    User.getByEmail.mockResolvedValueOnce(null);

    const userData = { email: 'test@example.com', password: 'password' };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered!');
    });

  test('register - email already exists', async () => {

    const user = {
      email: 'test@example.com',
      password: '$2a$12$hWuF8yyw7.iCPHBkdY78EeP6AHSBwcaHq7QChtliOCWDROwafPZAi', // Password: password
    };

    User.getByEmail.mockResolvedValueOnce([user]);

    const userData = { email: 'test@example.com', password: 'password' };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);


    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Something went wrong.');
  });

  test('login - success and request ressource behind middleware', async () => {

    const user = {
      email: 'test@example.com',
      password: '$2a$12$hWuF8yyw7.iCPHBkdY78EeP6AHSBwcaHq7QChtliOCWDROwafPZAi', // Password: password
    };
    User.getByEmail.mockResolvedValueOnce([user]);

    const loginData = { email: 'test@example.com', password: 'password' };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');

    // fixme split in two tests to know which part failed on error

    const token = response.body.token;
    const response_middleware = await request(app)
      .get('/api/ressource')
      .set('Authorization', `${token}`);

    expect(response_middleware.statusCode).toBe(404); //404 as the ressource does not exist
  });

  test('login - user not found and request ressource behind middleware', async () => {

    User.getByEmail.mockResolvedValueOnce([]);

    const loginData = { email: 'nonexistent@example.com', password: 'password' };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);


    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('credentials invalid');

    // fixme split test to test controller and token eval individually

    const response_middleware = await request(app)
      .get('/api/ressource')
      .set('Authorization', `TEST`);

    expect(response_middleware.statusCode).toBe(500); //500, JWT malformed
  });

  test('login - wrong password', async () => {

    const user = {
      email: 'test@example.com',
      password: '$2a$10$KrjxPz1GXXyjIvVdPwZBp.VJIPaWNG.JJe6IfK/l.CiQ5IaxE0T8e', // Password: password
    };
    User.getByEmail.mockResolvedValueOnce([user]);

    const loginData = { email: 'test@example.com', password: 'wrongpassword' };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);


    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('credentials invalid');
  });

  afterAll(() => {
    closeServer();
  });
});
