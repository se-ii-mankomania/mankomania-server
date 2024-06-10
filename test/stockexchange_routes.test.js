const jwt = require('jsonwebtoken');

const request = require('supertest');
const app = require('../server').app;
const closeServer = require('../server').closeServer;
const Session = require('../models/session');
const Lobby = require ('../models/lobby');
const StockExchange =require ('../models/stockexchange');

jest.mock('../models/session');
jest.mock('../models/lobby');
jest.mock('../models/stockexchange');

describe('StockExchange endpoints', () => {
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
    describe('GET /api/stockexchange/getStockChanges', () => {
        it('should make calculations', async () => {
            const mockSession = {
                id: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
                userid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
                lobbyid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
                color: 'red',
                currentposition: 1,
                balance: 10000,
                amountkvshares: 1,
                amounttshares: 1,
                amountbshares: 1,
                isplayersturn:  false
            };
          Session.getAllUsersByLobbyID.mockResolvedValueOnce([
                        { userid: mockSession.userid, balance: mockSession.balance, amountbshares: 1, amountkvshares:1, amounttshares:1 }
          ]);

          const mockMath = Object.create(global.Math);
          mockMath.random = jest.fn(() => 0.5);
          global.Math = mockMath;

          StockExchange.getAmountTShares.mockResolvedValueOnce(1);

          console.log("Done mocking");

          const response = await request(app).get('/api/stockexchange/getStockChanges/:lobbyid').set('Authorization', `${token1}`);

          console.log('Response:', response.status, response.body);

          expect(response.status).toBe(200);
          expect(response.body).toEqual( {'stockChange': 'tdesc'});
        });

        it('should handle errors', async () => {
          const errorMessage = 'Internal Server Error';
          Session.getAllUsersByLobbyID.mockRejectedValueOnce(new Error(errorMessage));

          const response = await request(app).get('/api/stockexchange/getStockChanges/:lobbyid').set('Authorization', `${token1}`);

          expect(response.status).toBe(500);
          expect(response.body).toEqual({ message: 'Something went wrong.' });
        });
    });
});