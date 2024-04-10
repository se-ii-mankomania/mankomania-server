const db = require('../database.js');

module.exports = class User{
    constructor(data){
        this.userId = data.userId || null;
        this.email = data.email;
        this.password = data.password;
    }


    static async getByEmail(email){
        try {
            const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(userId){
        try {
            const result = await db.query('SELECT userid, email FROM users WHERE userid = $1', [userId]);
            return result.rows;
        }catch (error) {
            throw error;
        }
    }

    static async register(user) {
        try {
          const result = await db.query(
            'INSERT INTO users (userid, email, password) VALUES (uuid_generate_v4(), $1, $2)',
            [user.email, user.password]
          );
          return result.rows;
        } catch (error) {
          throw error;
        }
    }

}
