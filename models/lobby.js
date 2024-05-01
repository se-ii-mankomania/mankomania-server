const db = require('../database.js');

module.exports = class Lobby{
    constructor(data){
        this.id = data.id;
        this.name = data.name;
        this.password = data.password || null;
        this.isPrivate = data.isPrivate;
        this.maxPlayers = data.maxPlayers;
        this.status = data.status;
    }


    static async getAll(){
        try {
            const result = await db.query('SELECT * FROM lobby');
            return result.rows;
        } catch (error) {
            throw error;
        }
    }


    static async getByStatus(status){
        try {
            const result = await db.query('SELECT * FROM lobby WHERE status = $1', [status]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(lobby){
        try {
            const result = await db.query(
                'INSERT INTO lobby (id, name, password, isPrivate, maxPlayers, status) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5)',
                [lobby.name, lobby.password, lobby.isPrivate, lobby.maxPlayers, lobby.status]
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async setStatus(lobby){
        try {
            const result = await db.query('UPDATE lobby SET status = $1 WHERE id = $2', [lobby.status, lobby.id]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}