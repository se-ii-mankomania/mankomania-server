const { Pool } = require('pg');

const express = require('express');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

const lobbyRoutes = require('./routes/lobby');

const authMiddleware = require('./middleware/auth');

const app = express();

const ports = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, X-Custom-Header, Authorization'
  );
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use('/api/auth', authRoutes);

app.use('/api/lobby', lobbyRoutes);

app.use(authMiddleware);

app.listen(ports, () => console.log(`Listening on port ${ports}`));