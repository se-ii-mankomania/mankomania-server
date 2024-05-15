const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: 'server.log' }),
        new winston.transports.Console({ silent: true })
    ]
});

function loggerMiddleware(req, res, next) {
    const clientIp = req.ip;
    const route = req.path;
    let logMessage = `Client IP: ${clientIp}, Route: ${route}`;
    
    if (req.method === 'POST') {
        logMessage += `, Parameters: ${JSON.stringify(req.body)}`;
    }

    logger.info(logMessage);

    next();
}

function errorHandler(err, req, res, next) {
    logger.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = {
    loggerMiddleware,
    errorHandler,
}
