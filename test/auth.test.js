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

  test('login - success', async () => {
    
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
  });

  test('login - user not found', async () => {
   
    User.getByEmail.mockResolvedValueOnce([]);

    const loginData = { email: 'nonexistent@example.com', password: 'password' };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);


    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('credentials invalid');
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
