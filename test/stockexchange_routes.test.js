const jwt = require('jsonwebtoken');

const request = require('supertest');
const app = require('../server').app;
const crypto = require('crypto');
const closeServer = require('../server').closeServer;
const Session = require('../models/session');
const StockExchange =require ('../models/stockexchange');

jest.mock('../models/session');
jest.mock('../models/stockexchange');
jest.spyOn(crypto, 'randomInt')
            .mockReturnValueOnce(3)
            .mockReturnValueOnce(4)
            .mockReturnValueOnce(1);

describe('StockExchange endpoints', () => {
    let token;
    beforeAll(() => {
    token = jwt.sign({userId: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',email: 'test@example.com',},

    process.env.JWT_SECRET,{ expiresIn: '1h' })});

    afterAll(() => {closeServer();});

    describe('GET/api/stockexchange/getStockChanges', () => {
        it('test getStockChanges case:tdesc', async () => {
          Session.getAllUsersByLobbyID.mockResolvedValueOnce([
                        { userid:'2d7820ac-fac8-4841-aaee-bc03cc4dde36', balance:10000, amountbshares: 1, amountkvshares:1, amounttshares:1 }
          ]);

          StockExchange.getAmountTShares.mockResolvedValueOnce(1);

          const response = await request(app).get('/api/stockexchange/getStockChanges/:lobbyid').set('Authorization', `${token}`);

          expect(response.status).toBe(200);
          expect(response.body).toEqual( {'stockChange': 'tdesc'});
        });

        it('test getStockChanges case:kasc', async () => {
          Session.getAllUsersByLobbyID.mockResolvedValueOnce([
                        { userid:'2d7820ac-fac8-4841-aaee-bc03cc4dde36', balance:10000, amountbshares: 1, amountkvshares:1, amounttshares:1 }
          ]);

          StockExchange.getAmountTShares.mockResolvedValueOnce(1);

          const response = await request(app).get('/api/stockexchange/getStockChanges/:lobbyid').set('Authorization', `${token}`);

          expect(response.status).toBe(200);
          expect(response.body).toEqual( {'stockChange': 'kasc'});
        });
        it('test getStockChanges case:bdesc', async () => {
          Session.getAllUsersByLobbyID.mockResolvedValueOnce([
                        { userid:'2d7820ac-fac8-4841-aaee-bc03cc4dde36', balance:10000, amountbshares: 1, amountkvshares:1, amounttshares:1 }
          ]);

          StockExchange.getAmountTShares.mockResolvedValueOnce(1);

          const response = await request(app).get('/api/stockexchange/getStockChanges/:lobbyid').set('Authorization', `${token}`);

          expect(response.status).toBe(200);
          expect(response.body).toEqual( {'stockChange': 'bdesc'});
        });

        it('should handle errors', async () => {
          const errorMessage = 'Internal Server Error';
          Session.getAllUsersByLobbyID.mockRejectedValueOnce(new Error(errorMessage));

          const response = await request(app).get('/api/stockexchange/getStockChanges/:lobbyid').set('Authorization', `${token}`);

          expect(response.status).toBe(500);
          expect(response.body).toEqual({ message: 'Something went wrong.' });
        });
    });
});