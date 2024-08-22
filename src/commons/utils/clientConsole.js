const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
};

const COLORS = {
    DEBUG: '#7f8c8d',
    INFO: '#2980b9',
    WARN: '#f39c12',
    ERROR: '#c0392b'
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
            console.log('%cDebug mode enabled. Log level set to DEBUG.', 'color: #27ae60; font-weight: bold;');
        } else {
            this.currentLevel = process.env.NODE_ENV === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;
            console.log(`%cprocess.env.NODE_ENV: ${process.env.NODE_ENV}\nisDebug: ${isDebug}`, 'color: #7f8c8d;');
            console.log(`%cDebug mode disabled. Log level set to ${Object.keys(LOG_LEVELS)[this.currentLevel]}.`, 'color: #7f8c8d;');
        }
    }

    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        const caller = this.getCaller();
        const color = COLORS[level];
        return [
            `%c[${timestamp}] [${level}]%c ${caller}%c\n${message}`,
            `color: ${color}; font-weight: bold;`,
            'color: #7f8c8d;',
            'color: #000000; font-weight: bold;'
        ];
    }


    getCaller() {
        const err = new Error();
        Error.captureStackTrace(err);
        const frames = err.stack.split('\n');
        let callerFrame;

        for (let i = 1; i < frames.length; i++) {
            const frame = frames[i];
            if (this.isApplicationFrame(frame)) {
                callerFrame = frame;
                break;
            }
        }

        if (!callerFrame) return 'unknown';

        const match = callerFrame.match(/at\s+(.+?)\s+\((.+)\)/);
        if (match) {
            const [, functionName, fullPath] = match;
            const pathMatch = fullPath.match(/\.\/src\/(.+?):(\d+):(\d+)/);
            if (pathMatch) {
                const [, filePath, lineNumber] = pathMatch;
                return `${functionName} (${filePath}:${lineNumber})`;
            }
        }

        return callerFrame.trim();
    }

    isApplicationFrame(frame) {
        return frame.includes('webpack-internal:') &&
            frame.includes('/src/') &&
            !this.isLibraryFrame(frame);
    }

    isLibraryFrame(frame) {
        const libraryPatterns = [
            'node_modules',
            'react-dom',
            'react-refresh',
            'next/dist',
            'clientConsole.js'
        ];
        return libraryPatterns.some(pattern => frame.includes(pattern));
    }

    log(level, message, ...args) {
        if (level >= this.currentLevel) {
            const [formattedMessage, ...styles] = this.formatMessage(Object.keys(LOG_LEVELS)[level], message);
            console.log(formattedMessage, ...styles, ...args);
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