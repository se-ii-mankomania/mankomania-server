require('dotenv').config();

const request = require('supertest');
const app = require('../server').app;
const closeServer = require('../server').closeServer;
const Lobby = require('../models/lobby');
const jwt = require('jsonwebtoken');


jest.mock('../models/lobby');

describe('Authentication endpoints', () => {
    let token
    beforeAll(() => {
    token = jwt.sign(
    {
        userId: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
        email: 'test@example.com',
        
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' })
    });

    afterAll(() => {
        closeServer();
    });

    it('should create a lobby with valid input', async () => {
        const requestBody = {
            name: 'Test Lobby',
            password: 'testPassword',
            isPrivate: true,
            maxPlayers: 4,
            status: 'open',
            stocktrend: 'basc'
        };

        Lobby.create.mockResolvedValueOnce(requestBody); 

        const response = await request(app)
            .post('/api/lobby/create')
            .set('Authorization', `${token}`)
            .send(requestBody);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Lobby created!');
    });

    it('should not create a lobby with invalid input', async () => {
        const requestBody = {
            name: 'A', 
            password: 'testPassword',
            isPrivate: 'true', 
            maxPlayers: 'invalid',
            status: 'invalidStatus',
            stocktrend: 'invalidStockTrend'
        };

        const response = await request(app)
            .post('/api/lobby/create')
            .set('Authorization', `${token}`)
            .send(requestBody);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Something went wrong.');
    });

    describe('GET /api/lobby/getAll', () => {
        it('should return all lobbies', async () => {
            const mockLobbies = {
                name: 'Test Lobby',
                password: 'testPassword',
                isPrivate: true,
                maxPlayers: 4,
                status: 'open',
                stocktrend: 'basc'
            };
          Lobby.getAll.mockResolvedValueOnce(mockLobbies);
    
          const response = await request(app).get('/api/lobby/getAll').set('Authorization', `${token}`);
    
          expect(response.status).toBe(200);
          expect(response.body).toEqual(mockLobbies);
        });
    
        it('should handle errors', async () => {
          const errorMessage = 'Internal Server Error';
          Lobby.getAll.mockRejectedValueOnce(new Error(errorMessage));
    
          const response = await request(app).get('/api/lobby/getAll').set('Authorization', `${token}`);
    
          expect(response.status).toBe(500);
          expect(response.body).toEqual({ message: 'Something went wrong.' });
        });
      });
    
      describe('GET /api/lobby/getByStatus/:status', () => {
        it('should return lobbies by status', async () => {
          const status = 'open';
          const mockLobbies = [{
            name: 'Test Lobby',
            password: 'testPassword',
            isPrivate: true,
            maxPlayers: 4,
            status: 'open',
            stocktrend: 'basc'
        },{
            name: 'Test Lobby2',
            password: 'testPassword2',
            isPrivate: true,
            maxPlayers: 4,
            status: 'closed',
            stocktrend: 'basc'
        }];
          Lobby.getByStatus.mockResolvedValueOnce(mockLobbies);
    
          const response = await request(app).get(`/api/lobby/getByStatus/${status}`).set('Authorization', `${token}`);
    
          expect(response.status).toBe(200);
          expect(response.body).toEqual(mockLobbies);
        });
    
        it('should handle errors', async () => {
          const status = 'open';
          const errorMessage = 'Internal Server Error';
          Lobby.getByStatus.mockRejectedValueOnce(new Error(errorMessage));
    
          const response = await request(app).get(`/api/lobby/getByStatus/${status}`).set('Authorization', `${token}`);
    
          expect(response.status).toBe(500);
          expect(response.body).toEqual({ message: 'Something went wrong.' });
        });
      });
});