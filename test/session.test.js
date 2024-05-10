const Session = require('../models/session');
const db = require('../database.js');

jest.mock('../database.js'); 

describe('Session model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        it('should create a Session object with provided data', () => {
            const data = {
                id: 1,
                userid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
                lobbyid: 'lobby1',
                color: 'red',
                currentposition: 0,
                balance: 100,
                amountkvshares: 10,
                amounttshares: 10,
                amountbshares: 10,
                isplayersturn: true
            };

            const session = new Session(data);

            expect(session.id).toBe(data.id);
            expect(session.userid).toBe(data.userid);
            expect(session.lobbyid).toBe(data.lobbyid);
            expect(session.color).toBe(data.color);
            expect(session.currentposition).toBe(data.currentposition);
            expect(session.balance).toBe(data.balance);
            expect(session.amountkvshares).toBe(data.amountkvshares);
            expect(session.amounttshares).toBe(data.amounttshares);
            expect(session.amountbshares).toBe(data.amountbshares);
            expect(session.isplayersturn).toBe(data.isplayersturn);
        });
    });

    describe('getAllByUserID method', () => {
        it('should return sessions by user ID', async () => {
            const userId = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';
            const mockRows = [{ id: 1, userid: userId, lobbyid: 'lobby1', color: 'red' }, { id: 2, userid: userId, lobbyid: 'lobby2', color: 'blue' }];
            const mockResult = { rows: mockRows };
            db.query.mockResolvedValueOnce(mockResult);

            const sessions = await Session.getAllByUserID(userId);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM session where userid = $1', [userId]);
            expect(sessions).toEqual(mockRows);
        });

        it('should throw an error if database query fails', async () => {
            const userId = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));

            await expect(Session.getAllByUserID(userId)).rejects.toThrow(errorMessage);
        });
    });

    describe('initializeSession method', () => {
        it('should initialize a session successfully with default values', async () => {
    
            const session = {
                userid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
                lobbyid: 'lobby1',
                isplayersturn: true
            };
    
            const mockResult = { rows: [{ session}] };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.initializeSession(session);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'INSERT INTO session (id, userid, lobbyid, color, currentposition, balance, amountkvshares, amounttshares, amountbshares, isplayersturn) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [session.userid, session.lobbyid, null, 0, 100, 10, 10, 10, session.isplayersturn]
            );
            expect(result).toEqual(mockResult.rows);
        });
    
        it('should throw an error if database query fails', async () => {
            const session = {
                userid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
                lobbyid: 'lobby1',
                isplayersturn: true
            };
    
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));
    
            await expect(Session.initializeSession(session)).rejects.toThrow(errorMessage);
        });
    });

    describe('setColor method', () => {
        it('should set color for session successfully', async () => {

            const session = {
                userid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
                lobbyid: 'lobby1',
                color: 'red'
            };

            const mockResult = { rows: [{ session }] };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.setColor(session);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'UPDATE session SET color = $1 WHERE userid = $2 AND lobbyid = $3',
                [session.color, session.userid, session.lobbyid]
            );
            expect(result).toEqual(mockResult.rows);
        });
    
        it('should throw an error if database query fails', async () => {
            const session = {
                userid: '2d7820ac-fac8-4841-aaee-bc03cc4dde36',
                lobbyid: 'lobby1',
                color: 'red'
            };
    
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));
    
            await expect(Session.setColor(session)).rejects.toThrow(errorMessage);
        });
    });
    
    
    
});
