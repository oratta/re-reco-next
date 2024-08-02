export function consoleLog(msg) {
    const error = new Error();
    const stack = error.stack.split('\n')[2]; // 0:Error 1:このメソッド 2:呼び出し元
    const match = stack.match(/at\s+(.+):(\d+):(\d+)/);
    const [, file, line, col] = match || [];
    console.log(`${file}:${line} -`, msg);
}

export function consoleError(error, msg, withTrace=false){
    const trace = new Error();
    const stack = trace.stack.split('\n')[2]; // 0:Error 1:このメソッド 2:呼び出し元
    const match = stack.match(/at\s+(.+):(\d+):(\d+)/);
    const [, file, line, col] = match || [];
    console.error(`${file}:${line} -`, msg);
    if (error instanceof Error) {
        console.error('Error message:', error.message);
        if(withTrace)console.error('Error stack:', error.stack);
    }
}