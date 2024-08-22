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
            console.log('Debug mode enabled. Log level set to DEBUG.');
        } else {
            this.currentLevel = process.env.NODE_ENV === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;
            console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}` + `\nisDebug: ${isDebug}`);
            console.log(`Debug mode disabled. Log level set to ${Object.keys(LOG_LEVELS)[this.currentLevel]}.`);
        }
    }

    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        const caller = this.getCaller();
        return `[${timestamp}] [${level.toUpperCase()}]\n${caller}\n${message}`;
    }

    getCaller() {
        const err = new Error();
        Error.captureStackTrace(err);
        const frames = err.stack.split('\n');
        let callerFrame;

        // アプリケーションコードのフレームを探す
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

        // フォールバック: 完全なスタックトレース行を返す
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