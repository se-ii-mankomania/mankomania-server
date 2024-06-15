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
        token = jwt.sign(
            { userId: '2d7820ac-fac8-4841-aaee-bc03cc4dde36', email: 'test@example.com' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    afterAll(() => {
        closeServer();
    });

    const testGetStockChanges = async (expectedStockChange) => {
        Session.getAllUsersByLobbyID.mockResolvedValueOnce([
            { userid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36', balance: 10000, amountbshares: 1, amountkvshares: 1, amounttshares: 1 }
        ]);

        StockExchange.getAmountTShares.mockResolvedValueOnce(1);

        const response = await request(app)
            .get('/api/stockexchange/getStockChanges/:lobbyid')
            .set('Authorization', `${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 'stockChange': expectedStockChange });
    };

    describe('GET /api/stockexchange/getStockChanges', () => {
        it('test getStockChanges case:tdesc', async () => {
            await testGetStockChanges('tdesc');
        });

        it('test getStockChanges case:kasc', async () => {
            await testGetStockChanges('kasc');
        });

        it('test getStockChanges case:bdesc', async () => {
            await testGetStockChanges('bdesc');
        });

        it('should handle errors', async () => {
            const errorMessage = 'Internal Server Error';
            Session.getAllUsersByLobbyID.mockRejectedValueOnce(new Error(errorMessage));

            const response = await request(app)
                .get('/api/stockexchange/getStockChanges/:lobbyid')
                .set('Authorization', `${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Something went wrong.' });
        });
    });

    describe('POST /setStockTrend/:lobbyid', () => {
        it('should set stock trend successfully', async () => {
            const lobbyid = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';
            const stockTrend = 'basc';

            StockExchange.updateCurrentStockTrend.mockResolvedValueOnce();

            const response = await request(app)
                .post(`/api/stockexchange/setStockTrend/${lobbyid}`)
                .set('Authorization', `${token}`)
                .send({ stocktrend: stockTrend });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'StockTrend set!');
            expect(StockExchange.updateCurrentStockTrend).toHaveBeenCalledWith(lobbyid, stockTrend);
        });

        it('should return 400 if stocktrend is invalid', async () => {
            const lobbyid = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';
            const invalidStocktrend = 'invalidTrend';

            const response = await request(app)
                .post(`/api/stockexchange/setStockTrend/${lobbyid}`)
                .set('Authorization', `${token}`)
                .send({ stocktrend: invalidStocktrend });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Something went wrong.');
        });

        it('should handle errors', async () => {
            const lobbyid = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';
            const stockTrend = 'basc';
            const errorMessage = 'Internal Server Error';

            StockExchange.updateCurrentStockTrend.mockRejectedValueOnce(new Error(errorMessage));

            const response = await request(app)
                .post(`/api/stockexchange/setStockTrend/${lobbyid}`)
                .set('Authorization', `${token}`)
                .send({ stocktrend: stockTrend });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Something went wrong.' });
        });
    });
    describe('GET /api/stockexchange/getStockTrendByLobbyID/:lobbyid', () => {
        it('should return the current stock trend for a given lobby', async () => {
            const lobbyid = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';
            const mockStockTrend = 'basc';

            StockExchange.getCurrentStockTrend.mockResolvedValueOnce(mockStockTrend);

            const response = await request(app)
                .get(`/api/stockexchange/getStockTrendByLobbyID/${lobbyid}`)
                .set('Authorization', `${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('stocktrend', mockStockTrend);
            expect(StockExchange.getCurrentStockTrend).toHaveBeenCalledWith(lobbyid);
        });

        it('should return 500 if there is an error', async () => {
            const lobbyid = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';
            const errorMessage = 'Internal Server Error';

            StockExchange.getCurrentStockTrend.mockRejectedValueOnce(new Error(errorMessage));

            const response = await request(app)
                .get(`/api/stockexchange/getStockTrendByLobbyID/${lobbyid}`)
                .set('Authorization', `${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Something went wrong.' });
        });
    });
    describe('GET /api/stockexchange/startStockExchange/:lobbyid', () => {
        it('should start the stock exchange minigame', async () => {
            const lobbyId = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';

            StockExchange.startStockExchangeMinigame.mockResolvedValueOnce();

            const response = await request(app)
                .get(`/api/stockexchange/startStockExchange/${lobbyId}`)
                .set('Authorization', `${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Stock Exchange started!');
            expect(StockExchange.startStockExchangeMinigame).toHaveBeenCalledWith(lobbyId);
        });

        it('should handle errors', async () => {
            const lobbyId = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';
            const errorMessage = 'Internal Server Error';

            StockExchange.startStockExchangeMinigame.mockRejectedValueOnce(new Error(errorMessage));

            const response = await request(app)
                .get(`/api/stockexchange/startStockExchange/${lobbyId}`)
                .set('Authorization', `${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Something went wrong.' });
        });
    });

    describe('GET /api/stockexchange/stopStockExchange/:lobbyid', () => {
        it('should end the stock exchange minigame', async () => {
            const lobbyId = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';

            StockExchange.endStockExchangeMinigame.mockResolvedValueOnce();

            const response = await request(app)
                .get(`/api/stockexchange/stopStockExchange/${lobbyId}`)
                .set('Authorization', `${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Stock Exchange ended!');
            expect(StockExchange.endStockExchangeMinigame).toHaveBeenCalledWith(lobbyId);
        });

        it('should handle errors', async () => {
            const lobbyId = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';
            const errorMessage = 'Internal Server Error';

            StockExchange.endStockExchangeMinigame.mockRejectedValueOnce(new Error(errorMessage));

            const response = await request(app)
                .get(`/api/stockexchange/stopStockExchange/${lobbyId}`)
                .set('Authorization', `${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Something went wrong.' });
        });
    });
});
