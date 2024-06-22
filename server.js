const { Pool } = require('pg');

const express = require('express');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

const lobbyRoutes = require('./routes/lobby');

const sessionRoutes = require('./routes/session');

const stockexchangeRoutes = require('./routes/stockexchange');

const boese1Routes = require('./routes/boese1');

const horseRaceRoutes = require('./routes/horserace')

const authMiddleware = require('./middleware/auth');

const loggerMiddleware = require('./middleware/log').loggerMiddleware;

const errorMiddleware = require('./middleware/log').errorHandler;

const app = express();

const ports = process.env.PORT || 3000;

app.disable('x-powered-by');

app.set('trust proxy', true)

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

app.use(authMiddleware);

app.use(loggerMiddleware)

app.use(errorMiddleware);

app.use('/api/lobby', lobbyRoutes);

app.use('/api/session', sessionRoutes);

app.use('/api/stockexchange', stockexchangeRoutes);

app.use('/api/', boese1Routes);

app.use('/api/horserace', horseRaceRoutes);

const server = app.listen(ports, () => console.log(`Listening on port ${ports}`));

function closeServer() {
  server.close();
}

module.exports = {closeServer, app};