const db = require('../database.js');

module.exports = class StockExchange{


    static async getAmountKvShares(session){
        try {
            const result = await db.query('SELECT amountkvshares FROM session where userid = $1 AND lobbyid = $2', [session.userid,session.lobbyid]);
            if (result.rows.length > 0) {
                return result.rows[0].amountkvshares;
            }
            return 0;
        } catch (error) {
            throw error;
        }
    }

    static async getAmountTShares(session){
        try {
            const result = await db.query('SELECT amounttshares FROM session where userid = $1 AND lobbyid = $2', [session.userid], session.lobbyid);
             if (result.rows.length > 0) {
                return result.rows[0].amounttshares;
             }
             return 0;
        } catch (error) {
            throw error;
        }
    }

    static async getAmountBShares(session){
        try {
            const result = await db.query('SELECT amountbshares FROM session where userid = $1 AND lobbyid = $2', [session.userid, session.lobbyid]);
            if (result.rows.length > 0) {
                return result.rows[0].amountbshares;
            }
            return 0;
        } catch (error) {
            throw error;
        }
    }

     static async updateBalance(userid,lobbyid, newBalance){
            try {
                const result = await db.query('UPDATE session SET balance = $1 WHERE userid = $2 AND lobbyid = $3', [newBalance, userid, lobbyid]);
                return result.rows;
            }catch (error) {
                throw error;
            }
     }
}