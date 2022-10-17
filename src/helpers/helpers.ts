
/*
let fidelioLog = console;
if (process.env.LOG_ENABLED != 'true') {
    fidelioLog.log = () => {}
}

 */

export const fidelioDebug = (msg: any, json = false) => {
    if (process.env.DEBUG_ENABLED !== 'true') return;
    if (json) msg = JSON.stringify(msg, null, 4)
    console.log(msg)
}
