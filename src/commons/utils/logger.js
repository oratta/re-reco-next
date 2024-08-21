import winston from 'winston';

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 're-reco' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}

export default logger;

// Helper functions
export function debug(message, meta = {}) {
    logger.debug(message, { ...meta, caller: getCaller() });
}

export function info(message, meta = {}) {
    logger.info(message, { ...meta, caller: getCaller() });
}

export function warn(message, meta = {}) {
    logger.warn(message, { ...meta, caller: getCaller() });
}

export function error(message, meta = {}) {
    logger.error(message, { ...meta, caller: getCaller() });
}

function getCaller() {
    const err = new Error();
    Error.captureStackTrace(err);
    const callerFrame = err.stack.split('\n')[3];
    const match = callerFrame.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
    if (match) {
        return `${match[1]} (${match[2]}:${match[3]})`;
    }
    return callerFrame;
}