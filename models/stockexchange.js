const db = require('../database.js');

module.exports = class StockExchange{


    static async getAmountKvShares(userId){
        try {
            const result = await db.query('SELECT amountkvshares FROM session where userid = $1', [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getAmountTShares(userId){
        try {
            const result = await db.query('SELECT amounttshares FROM session where userid = $1', [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getAmountBShares(userId){
        try {
            const result = await db.query('SELECT amountbshares FROM session where userid = $1', [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getRandomStockPrices(){
        const outcomes=['basc','bdesc','tasc','tdesc','kasc','kdesc','sonderzeichen'];
        const randomIndex = Math.floor(Math.random() * outcomes.length);
        return outcomes[randomIndex];
    }

    //TODO smart oder muss i weil async try-Blöcke? => besser in Controller

    static async getNewBalanceByShareType(shareType,userId,currentBalance){
        switch (type) {
                case 'basc':
                    return calcBalanceAfterAscending(getAmountBShares(userId),currentBalance);
                    break;
                case 'bdesc':
                    return calcBalanceAfterDescending(getAmountBShares(userId),currentBalance);
                    break;
                case 'tasc':
                    return calcBalanceAfterAscending(getAmountTShares(userId),currentBalance);
                    break;
                case 'tdesc':
                    return calcBalanceAfterDescending(getAmountTShares(userId),currentBalance);
                    break;
                case 'kasc':
                    return calcBalanceAfterAscending(getAmountKvShares(userId),currentBalance);
                    break;
                case 'kdesc':
                    return calcBalanceAfterDescending(getAmountKvShares(userId),currentBalance);
                    break;
                case 'sonderzeichen':
                    return calcBalanceAfterSonderzeichen(userId,currentBalance);
                    break;
                default:
                    // TODO add default aka error message(?)
                    break;
            }
    }

    static async calcBalanceAfterAscending(amountShares,currentBalance){
        return currentBalance+(amountShares*10000);
    }

    static async calcBalanceAfterDescending(amountShares,currentBalance){
        return currentBalance-(amountShares*10000);
    }

    static async calcBalanceAfterSonderzeichen(userId,currentBalance){
        const amountShares=getAmountKvShares(userId)+getAmountTShares(userId)+getAmountBShares(userId);
        return currentBalance+(amountShares*10000);
    }

    /*
    Konstruktor?
    BalanceUpdates von Session übernehmen
    */
}