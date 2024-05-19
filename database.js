const { Pool } = require('pg');
const envVariables = require('./utils/decrypt.js');

// fixme in general, all these vars should be env variables not decrypted from a versioned file
const dbHost = String(envVariables.DB_HOST);
const dbUser = String(envVariables.DB_USER);
const dbPassword = String(envVariables.DB_PASSWORD);
const dbName = String(envVariables.DB_NAME);

let pool = new Pool({
    host: dbHost,
 	user: dbUser,
 	password: dbPassword,
 	database: dbName,
})

module.exports = pool;