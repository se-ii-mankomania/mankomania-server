require('dotenv').config();
const { Pool } = require('pg');

let pool = new Pool({
	user: process.env.DATABASE_USER,
	host: process.env.DATABASE_HOST,
	database: process.env.DATABASE_NAME,
	password: process.env.DATABASE_PASSWORD,
	port: 5432,
})

module.exports = pool;