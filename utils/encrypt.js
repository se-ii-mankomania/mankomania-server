const fs = require('fs');
const crypto = require('crypto');

const secretKey = process.env.KEY; 
const envFile = fs.readFileSync('.env', 'utf8');
const iv = crypto.randomBytes(16); 

const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
let encryptedEnv = cipher.update(envFile, 'utf8', 'hex');
encryptedEnv += cipher.final('hex');

fs.writeFileSync('.env.encrypted', encryptedEnv);
fs.writeFileSync('.env.iv', iv.toString('hex')); 