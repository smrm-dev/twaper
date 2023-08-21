require("twaper")
const { twaper } = utils

const { strategies, outlierDetectionModes } = require('./constants/constants')

const cliProgress = require('cli-progress');
const colors = require('ansi-colors');

async function runTest(inputs, mode, logInfo) {
    const progressBar = new cliProgress.SingleBar({
        format: 'Test Progress |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
    progressBar.start(strategies.length * outlierDetectionModes.length, 0);

    const results = []
    const logs = []
    const stacks = []
    for (let strategy of strategies) {
        let result
        let logFile
        let stack
        for (let outlierDetectionMode of outlierDetectionModes) {
            const options = {
                tickStrategy: strategy,
                outlierDetection: outlierDetectionMode,
            }
            try {
                let tick
                if (mode == 'token') {
                    res = await twaper.calculateTick(...inputs, options, logInfo)
                }
                else if (mode == 'lp') {
                    res = await twaper.calculateLpTick(...inputs, options, logInfo)
                }
                else throw { message: 'Invalid test mode' }
                // price = res.price
                tick = res.tick
                logFile = res.logFile
                // result = twaper.toReadable(price, 18)
                result = tick
            }
            catch (e) {
                result = e.error ? e.error : String(e)
                logFile = e.logFile
                stack = e.stack
            }
            if (logFile) logs.push({ index: results.length, logFile })
            if (stack) stacks.push({ index: results.length, stack })
            results.push({ strategy, odm: outlierDetectionMode, result })
            progressBar.increment();
        }
    }
    progressBar.stop()
    console.log(inputs.at(-1))
    console.table(results)
    if (logs.length > 0) {
        console.log('Logs can be found here:')
        logs.forEach((log) => console.log('    Test No.', log.index, '\n        ', log.logFile))
    }
    if (stacks.length > 0) {
        console.log('Error stacks:')
        stacks.forEach((stack) => console.log('    Test No.', stack.index, '\n\n   ', stack.stack, '\n'))
    }
}

module.exports = {
    runTest,
}