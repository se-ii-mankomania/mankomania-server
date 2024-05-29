const db = require('../database.js');

module.exports = class StockExchange{


    static async getAmountKvShares(session){
        try {
            const result = await db.query('SELECT amountkvshares FROM session where userid = $1', [session.userid]);
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
            const result = await db.query('SELECT amounttshares FROM session where userid = $1', [session.userid]);
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
            const result = await db.query('SELECT amountbshares FROM session where userid = $1', [session.userid]);
            if (result.rows.length > 0) {
                return result.rows[0].amountbshares;
            }
            return 0;
        } catch (error) {
            throw error;
        }
    }
}