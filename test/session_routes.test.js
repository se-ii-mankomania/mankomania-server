const request = require('supertest');
const app = require('../server').app;
const closeServer = require('../server').closeServer;
const Session = require('../models/session');
const jwt = require('jsonwebtoken');
const envVariables = require('../utils/decrypt');

jest.mock('../models/session');

describe('Sessioncation endpoints', () => {
    let token1;
    beforeAll(() => {
    token1 = jwt.sign(
    {
        userId: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
        email: 'test@example.com',
        
    },
    envVariables.JWT,
    { expiresIn: '1h' })
    });

    afterAll(() => {
        closeServer();
    });

    describe('GET /api/session/getAll', () => {
        it('should return all sessions', async () => {
            const mockSession = {
                id: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
                userid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
                lobbyid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
                color: 'red',
                currentposition: 1,
                balance: 100,
                amountkvshares: 1,
                amounttshares: 1,
                mountbshares: 1,
                isplayersturn:  false
            };
          Session.getAllByUserID.mockResolvedValueOnce(mockSession);
    
          const response = await request(app).get('/api/session/getAll').set('Authorization', `${token1}`);
    
          expect(response.status).toBe(200);
          expect(response.body).toEqual(mockSession);
        });
    
        it('should handle errors', async () => {
          const errorMessage = 'Internal Server Error';
          Session.getAllByUserID.mockRejectedValueOnce(new Error(errorMessage));
    
          const response = await request(app).get('/api/session/getAll').set('Authorization', `${token1}`);
    
          expect(response.status).toBe(500);
          expect(response.body).toEqual({ message: 'Something went wrong.' });
        });
      });
      describe('Post /api/session/initialize', () => {
        it('join a session - success', async () => {
          Session.getMaxAmountOfUsersByLobbyID.mockResolvedValueOnce(4);
          Session.countUsersByLobbyID.mockResolvedValueOnce(3);
          Session.alreadyJoined.mockResolvedValueOnce([]);
    
          const response = (await request(app).post('/api/session/initialize').set('Authorization', `${token1}`).send({lobbyid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36'}));
    
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty('message', 'Session initialized!');
        });

        it('join a session - too many players already joined', async () => {
          Session.getMaxAmountOfUsersByLobbyID.mockResolvedValueOnce(4);
          Session.countUsersByLobbyID.mockResolvedValueOnce(4);
          Session.alreadyJoined.mockResolvedValueOnce([]);
    
          const response = (await request(app).post('/api/session/initialize').set('Authorization', `${token1}`).send({lobbyid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36'}));
    
          expect(response.status).toBe(400);
          expect(response.body).toHaveProperty('message', 'Lobby is full.');
        });
    
      });
    
});