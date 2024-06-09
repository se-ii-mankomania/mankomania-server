const request = require('supertest');
const app = require('../server').app;
const closeServer = require('../server').closeServer;
const Session = require('../models/session');
const StockExchange = require ('../models/stockexchange');
const jwt = require('jsonwebtoken');
const envVariables = require('../utils/decrypt');

jest.mock('../models/session');
jest.mock('../models/stockexchange');

describe('StockExchange endpoints', () => {
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


    describe('GET /api/stockexchange/getStockChanges/:lobbyid', () => {
        const lobbyId = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';

        beforeEach(() => {
            jest.clearAllMocks();
        });

        const mockSessionData = [
            { userid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36', balance: 100000 },

        ];

        const testCases = [
            { stockChange: 'basc', amountShares: 1, expectedBalance: (balance) => balance + 10000 },
            { stockChange: 'bdesc', amountShares: 1, expectedBalance: (balance) => balance - 10000 },
            { stockChange: 'tasc', amountShares: 1, expectedBalance: (balance) => balance + 10000 },
            { stockChange: 'tdesc', amountShares: 1, expectedBalance: (balance) => balance - 10000 },
            { stockChange: 'kasc', amountShares: 1, expectedBalance: (balance) => balance + 10000 },
            { stockChange: 'kdesc', amountShares: 1, expectedBalance: (balance) => balance - 10000 },
            {stockChange: 'sonderzeichen', amountShares: 3, expectedBalance: (balance) => balance + 30000 }
        ];

        testCases.forEach(({ stockChange, amountShares, expectedBalance }) => {
            it(`should handle "${stockChange}" outcome`, async () => {
                Session.getAllUsersByLobbyID.mockResolvedValueOnce(mockSessionData);
                StockExchange.getAmountBShares.mockResolvedValueOnce(amountShares);
                StockExchange.getAmountTShares.mockResolvedValueOnce(amountShares);
                StockExchange.getAmountKvShares.mockResolvedValueOnce(amountShares);
                Session.getBalance.mockImplementation(({ userid }) => {
                    const session = mockSessionData.find(session => session.userid === userid);
                    return session ? session.balance : 0;
                });
                StockExchange.updateBalance.mockImplementation(async (userid, lobbyid, newBalance) => {
                    const session = mockSessionData.find(session => session.userid === userid);
                    expect(newBalance).toBe(expectedBalance(session.balance));
                });

                const response = await request(app).get('/api/stockexchange/getStockChanges/lobbyId').set('Authorization', `${token1}`);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('stockChange', stockChange);
            });
        });

        it('should handle errors', async () => {
            const errorMessage = 'Internal Server Error';
            Session.getAllUsersByLobbyID.mockRejectedValueOnce(new Error(errorMessage));

            const response = await request(app)
                .get(`/api/stockexchange/getStockChanges/${lobbyId}`)
                .set('Authorization', token1);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Something went wrong.' });
        });
    });

});