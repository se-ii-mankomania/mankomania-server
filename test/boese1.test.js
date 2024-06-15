require('dotenv').config();
const request = require('supertest');
const app = require('../server').app;
const closeServer = require('../server').closeServer;
const Session = require('../models/session');
const jwt = require('jsonwebtoken');

jest.mock('../models/session');

describe('boese1 Endpoint', () => {
    let token;
    const lobbyId = '2d7820ac-fac8-4841-aaee-bc03cc4dde36'; 
    const userId = '2d7820ac-fac8-4841-aaee-bc03cc4dde36'; 

    beforeAll(() => {
        token = jwt.sign(
            {
                userId: userId,
                email: 'test@example.com',
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    afterAll(() => {
        closeServer();
    });

    const performTest = async (requestBody, initialBalance, expectedBalance) => {
        const session = {
            userid: 'user1',
            lobbyid: 'lobby1',
            currentposition: 5
        };
        const mockResult = { rows: [session] };

        Session.getBalance.mockResolvedValueOnce(initialBalance);
        Session.updateBalance.mockResolvedValueOnce(mockResult.rows);

        const response = await request(app)
            .post(`/api/boese1/${lobbyId}`)
            .set('Authorization', `${token}`)
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(Session.getBalance).toHaveBeenCalledWith({ userid: userId, lobbyid: lobbyId });
        expect(Session.updateBalance).toHaveBeenCalledWith({ userid: userId, lobbyid: lobbyId }, expectedBalance);
    };

    it('should update the balance correctly for valid input: 0 one', async () => {
        const requestBody = {
            sum: 10,
            one: 0
        };
        const initialBalance = 100000;
        const expectedBalance = initialBalance - requestBody.sum * 5000;
        await performTest(requestBody, initialBalance, expectedBalance);
    });

    it('should update the balance correctly for valid input: 1 one', async () => {
        const requestBody = {
            sum: 10,
            one: 1
        };
        const initialBalance = 100000;
        const expectedBalance = initialBalance + 100000;
        await performTest(requestBody, initialBalance, expectedBalance);
    });

    it('should update the balance correctly for valid input: 2 one', async () => {
        const requestBody = {
            sum: 10,
            one: 2
        };
        const initialBalance = 100000;
        const expectedBalance = initialBalance + 300000;
        await performTest(requestBody, initialBalance, expectedBalance);
    });

    it('should return 400 for invalid input', async () => {
        const invalidRequestBody = {
            sum: "invalid", 
            one: 5 
        };

        const response = await request(app)
            .post(`/api/boese1/${lobbyId}`)
            .set('Authorization', `${token}`)
            .send(invalidRequestBody);

        expect(response.status).toBe(400);
    });
});