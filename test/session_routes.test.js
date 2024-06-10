const jwt = require('jsonwebtoken');

const request = require('supertest');
const app = require('../server').app;
const closeServer = require('../server').closeServer;
const Session = require('../models/session');
const Lobby = require ('../models/lobby');

jest.mock('../models/session');
jest.mock('../models/lobby');

describe('Sessioncation endpoints', () => {
    let token1;
    beforeAll(() => {
    token1 = jwt.sign(
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
          Session.countUsersByLobbyID.mockResolvedValueOnce(2);
          Session.alreadyJoined.mockResolvedValueOnce([]);
          Lobby.setStatus.mockResolvedValueOnce();
    
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
      describe('GET /api/session/unavailableColors/:lobbyid', () => {
        it('should return unavailable colors successfully', async () => {
            const mockColors = [
                { color: 'red' },
                { color: 'blue' }
            ];
            Session.getUnavailableColors.mockResolvedValueOnce(mockColors);
            
            const response = await request(app).get('/api/session/unavailableColors/lobbyId').set('Authorization', `${token1}`);
    
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockColors);
        });
    
        it('should handle errors', async () => {
            const errorMessage = 'Internal Server Error';
            Session.getUnavailableColors.mockRejectedValueOnce(new Error(errorMessage));
    
            const response = await request(app).get('/api/session/unavailableColors/lobbyId').set('Authorization', `${token1}`);
    
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Something went wrong.' });
        });
    });

    describe('POST /api/session/setColor/:lobbyid', () => {
      it('should set color successfully', async () => {
          const mockSession = {
              userid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
              color: 'red',
              lobbyid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36'
          };
  
          Session.setColor.mockResolvedValueOnce(); // Mock successful setColor call
  
          const response = await request(app)
              .post(`/api/session/setColor/${mockSession.lobbyid}`)
              .set('Authorization', `${token1}`)
              .send({ color: mockSession.color });
  
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty('message', 'Color set!');
      });
  
      it('should handle errors', async () => {
          const errorMessage = 'Internal Server Error';
          Session.setColor.mockRejectedValueOnce(new Error(errorMessage));
  
          const response = await request(app)
              .post('/api/session/setColor/lobbyId')
              .set('Authorization', `${token1}`)
              .send({ color: 'red' });
  
          expect(response.status).toBe(500);
          expect(response.body).toEqual({ message: 'Something went wrong.' });
      });
  });
  
    
      describe('GET /api/session/status/:lobbyid', () => {
        it('should return all users in a lobby', async () => {
            const mockUsers = [
                {
                    userid: "9e52a583-c715-4ca8-9789-68c12085e2e5",
                    email: "testpass@test.at",
                    color: "red",
                    currentposition: 0,
                    balance: 100,
                    isplayersturn: false
                },
                {
                    userid: "482833b8-db64-4550-8684-35d00a5ae02f",
                    email: "testneu@test.at",
                    color: null,
                    currentposition: 0,
                    balance: 100,
                    isplayersturn: false
                },
                {
                    userid: "fefdafa6-9dc3-45e5-b0e9-b4864407815f",
                    email: "test12@test.at",
                    color: null,
                    currentposition: 0,
                    balance: 100,
                    isplayersturn: true
                },
                {
                    userid: "4dfb2ff3-9065-494c-be25-c47b935f8edb",
                    email: "test23@test.at",
                    color: "blue",
                    currentposition: 4,
                    balance: 70100,
                    isplayersturn: false
                }
            ];
            Session.getAllUsersByLobbyID.mockResolvedValueOnce(mockUsers);
    
            const response = await request(app).get('/api/session/status/lobbyId').set('Authorization', `${token1}`);
    
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUsers);
        });
    
        it('should handle errors', async () => {
            const errorMessage = 'Internal Server Error';
            Session.getAllUsersByLobbyID.mockRejectedValueOnce(new Error(errorMessage));
    
            const response = await request(app).get('/api/session/status/lobbyId').set('Authorization', `${token1}`);
    
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Something went wrong.' });
        });
    });
    describe('POST /api/session/setPosition/:lobbyid', () => {
      it('should set position successfully', async () => {
          const mockSession = {
              userid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
              currentposition: 1,
              lobbyid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36'
          };
  
          const mockEffect = 10; 
          const mockBalance = 100; 
          const mockNewBalance = mockBalance + mockEffect; 
  
          Session.getEffectOfField.mockResolvedValueOnce(mockEffect);
          Session.getBalance.mockResolvedValueOnce(mockBalance);
          Session.setPosition.mockResolvedValueOnce(); 
          Session.getAllUsersByLobbyID.mockResolvedValueOnce([
              { userid: mockSession.userid, isplayersturn: true }, 
              { userid: 'Hallo', isplayersturn: false } 
          ]);
  
          const response = await request(app)
              .post(`/api/session/setPosition/${mockSession.lobbyid}`)
              .set('Authorization', `${token1}`)
              .send({ currentposition: mockSession.currentposition });
  
          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty('message', 'Position set!');
  
          expect(Session.setIsPlayerTurn).toHaveBeenCalledWith({
              userid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
              lobbyid: mockSession.lobbyid,
              isplayersturn: false
          });
          expect(Session.setIsPlayerTurn).toHaveBeenCalledWith({
              userid: 'Hallo',
              lobbyid: mockSession.lobbyid,
              isplayersturn: true
          });
  
          expect(Session.updateBalance).toHaveBeenCalledWith(mockSession, mockNewBalance);
      });
  
      it('should handle errors', async () => {
          const errorMessage = 'Internal Server Error';
          Session.setPosition.mockRejectedValueOnce(new Error(errorMessage));
  
          const response = await request(app)
              .post('/api/session/setPosition/lobbyId')
              .set('Authorization', `${token1}`)
              .send({ currentposition: 1 });
  
          expect(response.status).toBe(500);
          expect(response.body).toEqual({ message: 'Something went wrong.' });
      });
  });
  
    
    
});