const fs = require('fs');
const crypto = require('crypto');

const secretKey = process.env.KEY;

const encryptedEnv = fs.readFileSync('.env.encrypted', 'utf8');
const iv = Buffer.from(fs.readFileSync('.env.iv', 'utf8'), 'hex');

const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
let decryptedEnv = decipher.update(encryptedEnv, 'hex', 'utf8');
decryptedEnv += decipher.final('utf8');


//parse into array
const envVariables = {};
const envLines = decryptedEnv.split('\n');
envLines.forEach(line => {
    const [key, value] = line.split('=');
    envVariables[key.trim()] = value.trim();
});
module.exports = envVariables;
