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

    describe('alreadyJoined method', () => {
        it('should return sessions where the user has already joined the lobby', async () => {
            const userId = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';
            const lobbyId = 'lobby1';
            const mockRows = [{ userId, lobbyId, color: 'red'}];
            const mockResult = { rows: mockRows };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.alreadyJoined(userId, lobbyId);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'SELECT * FROM session WHERE userid = $1 AND lobbyid = $2',
                [userId, lobbyId]
            );
            expect(result).toEqual(mockRows);
        });
    
        it('should throw an error if database query fails', async () => {
            const userId = '2d7820ac-fac8-4841-aaee-bc03cc4dde36';
            const lobbyId = 'lobby1';
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));
    
            await expect(Session.alreadyJoined(userId, lobbyId)).rejects.toThrow(errorMessage);
        });
    });
    
    describe('getUnavailableColors method', () => {
        it('should return colors that are already taken in the lobby', async () => {
            const lobbyId = 'lobby1';
            const mockRows = [{ color: 'red' }, { color: 'blue' }];
            const mockResult = { rows: mockRows };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.getUnavailableColors(lobbyId);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'SELECT color FROM session WHERE lobbyid = $1',
                [lobbyId]
            );
            expect(result).toEqual(mockRows);
        });
    
        it('should throw an error if database query fails', async () => {
            const lobbyId = 'lobby1';
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));
     
            await expect(Session.getUnavailableColors(lobbyId)).rejects.toThrow(errorMessage);
        });
    });

    describe('getAllUsersByLobbyID method', () => {
        it('should return all users in the specified lobby', async () => {
            const lobbyId = 'lobby1';
            const mockRows = [{ lobbyId }];
            const mockResult = { rows: mockRows };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.getAllUsersByLobbyID(lobbyId);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'SELECT u.userid, u.email, s.color, s.currentposition, s.balance, s.isPlayersTurn FROM users u JOIN session s ON u.userid = s.userid WHERE s.lobbyid = $1;',
                [lobbyId]
            );
            expect(result).toEqual(mockRows);
        });
    
        it('should throw an error if database query fails', async () => {
            const lobbyId = 'lobby1';
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));
    
            await expect(Session.getAllUsersByLobbyID(lobbyId)).rejects.toThrow(errorMessage);
        });
    });
    
    describe('countUsersByLobbyID method', () => {
        it('should return the count of users in the specified lobby', async () => {
            const lobbyId = 'lobby1';
            const mockCount = 5;
            const mockResult = { rows: [{ count: mockCount }] };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.countUsersByLobbyID(lobbyId);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'SELECT COUNT(u.userid) FROM users u JOIN session s ON u.userid = s.userid WHERE s.lobbyid = $1;',
                [lobbyId]
            );
            expect(result).toEqual(mockCount);
        });
    
        it('should return null if no users are found in the specified lobby', async () => {
            const lobbyId = 'lobby1';
            const mockResult = { rows: [] };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.countUsersByLobbyID(lobbyId);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'SELECT COUNT(u.userid) FROM users u JOIN session s ON u.userid = s.userid WHERE s.lobbyid = $1;',
                [lobbyId]
            );
            expect(result).toBeNull();
        });
    
        it('should throw an error if database query fails', async () => {
            const lobbyId = 'lobby1';
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));
    
            await expect(Session.countUsersByLobbyID(lobbyId)).rejects.toThrow(errorMessage);
        });
    });
    
    describe('getMaxAmountOfUsersByLobbyID method', () => {
        it('should return the maximum amount of users allowed in the specified lobby', async () => {
            const lobbyId = 'lobby1';
            const mockMaxPlayers = 4;
            const mockResult = { rows: [{ maxplayers: mockMaxPlayers }] };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.getMaxAmountOfUsersByLobbyID(lobbyId);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'SELECT maxplayers FROM lobby WHERE id = $1;',
                [lobbyId]
            );
            expect(result).toEqual(mockMaxPlayers);
        });
    
        it('should return null if no lobby is found with the specified ID', async () => {
            const lobbyId = 'lobby1';
            const mockResult = { rows: [] };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.getMaxAmountOfUsersByLobbyID(lobbyId);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'SELECT maxplayers FROM lobby WHERE id = $1;',
                [lobbyId]
            );
            expect(result).toBeNull();
        });
    
        it('should throw an error if database query fails', async () => {
            const lobbyId = 'lobby1';
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));
    
            await expect(Session.getMaxAmountOfUsersByLobbyID(lobbyId)).rejects.toThrow(errorMessage);
        });
    });
    
    describe('setPosition method', () => {
        it('should set the current position of the user in the specified lobby', async () => {
            const session = {
                userid: 'user1',
                lobbyid: 'lobby1',
                currentposition: 5
            };
            const mockResult = { rows: [session] };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.setPosition(session);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'UPDATE session SET currentposition = $1 WHERE userid = $2 AND lobbyid = $3',
                [session.currentposition, session.userid, session.lobbyid]
            );
            expect(result).toEqual(mockResult.rows);
        });
    
        it('should throw an error if database query fails', async () => {
            const session = {
                userid: 'user1',
                lobbyid: 'lobby1',
                currentposition: 5
            };
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));
    
            await expect(Session.setPosition(session)).rejects.toThrow(errorMessage);
        });
    });
    
    describe('setIsPlayerTurn method', () => {
        it('should set the isPlayerTurn field in the session table', async () => {
            const session = {
                userid: 'user1',
                lobbyid: 'lobby1',
                isplayersturn: true
            };
            const mockResult = { rows: [session] };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.setIsPlayerTurn(session);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'UPDATE session SET isPlayersTurn = $1 WHERE userid = $2 AND lobbyid = $3',
                [session.isplayersturn, session.userid, session.lobbyid]
            );
            expect(result).toEqual(mockResult.rows);
        });
    
        it('should throw an error if database query fails', async () => {
            const session = {
                userid: 'user1',
                lobbyid: 'lobby1',
                isplayersturn: true
            };
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));
    
            await expect(Session.setIsPlayerTurn(session)).rejects.toThrow(errorMessage);
        });
    });
    
    describe('getEffectOfField method', () => {
        it('should return the effect of the field at the current position', async () => {
            const session = {
                currentposition: 5
            };
            const mockEffect = 10;
            const mockResult = { rows: [{ effect: mockEffect }] };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.getEffectOfField(session);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'SELECT effect FROM field WHERE id = $1',
                [session.currentposition]
            );
            expect(result).toEqual(mockEffect);
        });
    
        it('should return null if no effect is found for the field at the current position', async () => {
            const session = {
                currentposition: 5
            };
            const mockResult = { rows: [] };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.getEffectOfField(session);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'SELECT effect FROM field WHERE id = $1',
                [session.currentposition]
            );
            expect(result).toBeNull();
        });
    
        it('should throw an error if database query fails', async () => {
            const session = {
                currentposition: 5
            };
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));
    
            await expect(Session.getEffectOfField(session)).rejects.toThrow(errorMessage);
        });
    });
    
    describe('getBalance method', () => {
        it('should return the balance of the user in the specified lobby', async () => {
            const session = {
                userid: 'user1',
                lobbyid: 'lobby1'
            };
            const mockBalance = 100;
            const mockResult = { rows: [{ balance: mockBalance }] };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.getBalance(session);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'SELECT balance FROM session WHERE userid = $1 AND lobbyid = $2',
                [session.userid, session.lobbyid]
            );
            expect(result).toEqual(mockBalance);
        });
    
        it('should return null if no balance is found for the user in the specified lobby', async () => {
            const session = {
                userid: 'user1',
                lobbyid: 'lobby1'
            };
            const mockResult = { rows: [] };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.getBalance(session);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'SELECT balance FROM session WHERE userid = $1 AND lobbyid = $2',
                [session.userid, session.lobbyid]
            );
            expect(result).toBeNull();
        });
    
        it('should throw an error if database query fails', async () => {
            const session = {
                userid: 'user1',
                lobbyid: 'lobby1'
            };
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));
    
            await expect(Session.getBalance(session)).rejects.toThrow(errorMessage);
        });
    });
    
    describe('updateBalance method', () => {
        it('should update the balance of the user in the specified lobby', async () => {
            const session = {
                userid: 'user1',
                lobbyid: 'lobby1'
            };
            const newBalance = 150;
            const mockResult = { rows: [session] };
            db.query.mockResolvedValueOnce(mockResult);
    
            const result = await Session.updateBalance(session, newBalance);
    
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'UPDATE session SET balance = $1 WHERE userid = $2 AND lobbyid = $3',
                [newBalance, session.userid, session.lobbyid]
            );
            expect(result).toEqual(mockResult.rows);
        });
    
        it('should throw an error if database query fails', async () => {
            const session = {
                userid: 'user1',
                lobbyid: 'lobby1'
            };
            const newBalance = 150;
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));
    
            await expect(Session.updateBalance(session, newBalance)).rejects.toThrow(errorMessage);
        });
    });
    
    
});
