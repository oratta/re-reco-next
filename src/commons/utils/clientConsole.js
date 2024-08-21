const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
};

class ClientConsole {
    constructor() {
        this.debugMode = false;
        this.currentLevel = process.env.NODE_ENV === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;
    }

    setDebugMode(isDebug) {
        this.debugMode = isDebug;
        if (isDebug && process.env.NODE_ENV !== 'production') {
            this.currentLevel = LOG_LEVELS.DEBUG;
        }
    }

    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        const caller = this.getCaller();
        return `[${timestamp}] [${level.toUpperCase()}] ${caller}: ${message}`;
    }

    getCaller() {
        const err = new Error();
        Error.captureStackTrace(err);
        const callerFrame = err.stack.split('\n')[3];
        const match = callerFrame.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
        if (match) {
            return `${match[1]} (${match[2]}:${match[3]})`;
        }
        return callerFrame;
    }

    log(level, message, ...args) {
        if (level >= this.currentLevel) {
            const formattedMessage = this.formatMessage(Object.keys(LOG_LEVELS)[level], message);
            console.log(formattedMessage, ...args);
        }
    }

    debug(message, ...args) {
        this.log(LOG_LEVELS.DEBUG, message, ...args);
    }

    info(message, ...args) {
        this.log(LOG_LEVELS.INFO, message, ...args);
    }

    warn(message, ...args) {
        this.log(LOG_LEVELS.WARN, message, ...args);
    }

    error(message, ...args) {
        this.log(LOG_LEVELS.ERROR, message, ...args);
    }
}

const clientConsole = new ClientConsole();

export default clientConsole;