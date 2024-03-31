const jwt = require('jsonwebtoken');
const envVariables = require('../utils/decrypt');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated!');
    error.statusCode = 401;
    throw error;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(authHeader, envVariables.JWT);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated!');
    error.statusCode = 401;
    throw error;
  }
  req.isLoggedIn = true;
  req.userId = decodedToken.userid;
  req.email = decodedToken.email;
  next();
};