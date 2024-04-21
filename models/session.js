const db = require('../database.js');

module.exports = class Session{

    constructor(data){
        this.id = data.id;
        this.userid = data.userid;
        this.lobbyid = data.lobbyid;
        this.color = data.color|| null;
        this.currentposition = data.currentposition;
        this.balance = data.balance;
        this.amount5knotes = data.amount5knotes;
        this.amount10knotes = data.amount10knotes;
        this.amount50knotes = data.amount50knotes;
        this.amount100knotes = data.amount100knotes;
        this.amountkvshares = data.amountkvshares;
        this.amounttshares = data.amounttshares;
        this.amountbshares = data.amountbshares;
        this.isplayersturn = data.isplayersturn;
    }

    static async getAllByUserID(userId){
        try {
            const result = await db.query('SELECT * FROM session where userid = $1', [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async initializeSession(session){
        try {
            const result = await db.query(
                'INSERT INTO session (id, userid, lobbyid, color, currentposition, balance, amount5knotes, amount10knotes, amount50knotes, amount100knotes, amountkvshares, amounttshares, amountbshares, isplayersturn) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
                [session.userid, session.lobbyid, null, 1, 100, 10, 5, 4, 7, 10, 10, 10, session.isplayersturn]
            );            
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async setColor(session){
        try {
            const result = await db.query('UPDATE session SET color = $1 WHERE userid = $2 AND lobbyid = $3', [session.color, session.userid, session.lobbyid]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async alreadyJoined(userId, lobbyId){
        try {
            const result = await db.query('SELECT * FROM session WHERE userid = $1 AND lobbyid = $2', [userId, lobbyId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getUnavailableColors(lobbyId){
        try {
            const result = await db.query('SELECT color FROM session WHERE lobbyid = $1', [lobbyId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getAllUsersByLobbyID(lobbyId){
        try {
            const result = await db.query('SELECT u.userid, u.email, s.color, s.currentposition, s.balance, s.isPlayersTurn FROM users u JOIN session s ON u.userid = s.userid WHERE s.lobbyid = $1;', [lobbyId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async countUsersByLobbyID(lobbyId){
        try {
            const result = await db.query('SELECT COUNT(u.userid) FROM users u JOIN session s ON u.userid = s.userid WHERE s.lobbyid = $1;', [lobbyId]);
            if (result.rows.length > 0) {
                return result.rows[0].count;
            } else {
                return null; 
            }
        } catch (error) {
            throw error;
        }
    }

    static async getMaxAmountOfUsersByLobbyID(lobbyId){
        try {
            const result = await db.query('SELECT maxplayers FROM lobby WHERE id = $1;', [lobbyId]);
            if (result.rows.length > 0) {
                return result.rows[0].maxplayers;
            } else {
                return null; 
            }
        } catch (error) {
            throw error;
        }
    }
}