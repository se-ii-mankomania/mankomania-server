const db = require('../database.js');

module.exports = class Lobby{
    constructor(data){
        this.id = data.id;
        this.name = name;
        this.password = password || null;
        this.isPrivate = isPrivate;
        this.maxPlayers = maxPlayers;
        this.status = status;
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
}