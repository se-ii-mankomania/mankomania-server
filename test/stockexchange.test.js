const StockExchange = require('../models/stockexchange');
const db = require('../database.js');

jest.mock('../database.js');

describe('StockExchange model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAmountKvShares method', () => {
        it('should return the amount of Kv shares for a given session', async () => {
            const session = { userid: 'user1'};
            const lobbyid='lobby1';
            const mockAmount = 10;
            const mockResult = { rows: [{ amountkvshares: mockAmount }] };
            db.query.mockResolvedValueOnce(mockResult);

            const result = await StockExchange.getAmountKvShares(session, lobbyid);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith('SELECT amountkvshares FROM session where userid = $1 AND lobbyid = $2', [session.userid, lobbyid]);
            expect(result).toEqual(mockAmount);
        });

        it('should return 0 if no Kv shares are found for the given session', async () => {
            const session = { userid: 'user1'};
            const lobbyid='lobby1';
            const mockResult = { rows: [] };
            db.query.mockResolvedValueOnce(mockResult);

            const result = await StockExchange.getAmountKvShares(session, lobbyid);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith('SELECT amountkvshares FROM session where userid = $1 AND lobbyid = $2', [session.userid, lobbyid]);
            expect(result).toEqual(0);
        });

        it('should throw an error if database query fails', async () => {
            const session = { userid: 'user1'};
            const lobbyid='lobby1';
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));

            await expect(StockExchange.getAmountKvShares(session)).rejects.toThrow(errorMessage);
        });
    });

    describe('getAmountTShares method', () => {
        it('should return the amount of T shares for a given session', async () => {
            const session = { userid: 'user1'};
            const lobbyid='lobby1';
            const mockAmount = 20;
            const mockResult = { rows: [{ amounttshares: mockAmount }] };
            db.query.mockResolvedValueOnce(mockResult);

            const result = await StockExchange.getAmountTShares(session,lobbyid);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith('SELECT amounttshares FROM session where userid = $1 AND lobbyid = $2', [session.userid, lobbyid]);
            expect(result).toEqual(mockAmount);
        });

        it('should return 0 if no T shares are found for the given session', async () => {
            const session = { userid: 'user1'};
            const lobbyid='lobby1';
            const mockResult = { rows: [] };
            db.query.mockResolvedValueOnce(mockResult);

            const result = await StockExchange.getAmountTShares(session,lobbyid);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith('SELECT amounttshares FROM session where userid = $1 AND lobbyid = $2', [session.userid, lobbyid]);
            expect(result).toEqual(0);
        });

        it('should throw an error if database query fails', async () => {
            const session = { userid: 'user1'};
            const lobbyid='lobby1';
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));

            await expect(StockExchange.getAmountTShares(session)).rejects.toThrow(errorMessage);
        });
    });

    describe('getAmountBShares method', () => {
        it('should return the amount of B shares for a given session', async () => {
            const session = { userid: 'user1'};
            const lobbyid='lobby1';
            const mockAmount = 30;
            const mockResult = { rows: [{ amountbshares: mockAmount }] };
            db.query.mockResolvedValueOnce(mockResult);

            const result = await StockExchange.getAmountBShares(session,lobbyid);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith('SELECT amountbshares FROM session where userid = $1 and lobbyid = $2', [session.userid, lobbyid]);
            expect(result).toEqual(mockAmount);
        });

        it('should return 0 if no B shares are found for the given session', async () => {
            const session = { userid: 'user1'};
            const lobbyid='lobby1';
            const mockResult = { rows: [] };
            db.query.mockResolvedValueOnce(mockResult);

            const result = await StockExchange.getAmountBShares(session,lobbyid);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith('SELECT amountbshares FROM session where userid = $1 and lobbyid = $2', [session.userid, lobbyid]);
            expect(result).toEqual(0);
        });

        it('should throw an error if database query fails', async () => {
            const session = { userid: 'user1'};
            const lobbyid='lobby1';
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));

            await expect(StockExchange.getAmountBShares(session)).rejects.toThrow(errorMessage);
        });
    });

    describe('updateBalance method', () => {
        it('should update the balance for a given user and lobby', async () => {
            const userid = 'user1';
            const lobbyid = 'lobby1';
            const newBalance = 150;
            const mockResult = { rows: [] };
            db.query.mockResolvedValueOnce(mockResult);

            const result = await StockExchange.updateBalance(userid, lobbyid, newBalance);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith(
                'UPDATE session SET balance = $1 WHERE userid = $2 AND lobbyid = $3',
                [newBalance, userid, lobbyid]
            );
            expect(result).toEqual(mockResult.rows);
        });

        it('should throw an error if database query fails', async () => {
            const userid = 'user1';
            const lobbyid = 'lobby1';
            const newBalance = 150;
            const errorMessage = 'Database error';
            db.query.mockRejectedValueOnce(new Error(errorMessage));

            await expect(StockExchange.updateBalance(userid, lobbyid, newBalance)).rejects.toThrow(errorMessage);
        });
    });
});
