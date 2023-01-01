require("twaper")
const { twaper } = utils

const { strategies, outlierDetectionModes } = require('./constants/constants')

const cliProgress = require('cli-progress');
const colors = require('ansi-colors');

async function runLpTest(chainId, lp, routes0, routes1, toBlocks) {
    const progressBar = new cliProgress.SingleBar({
        format: 'Test Progress |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
    progressBar.start(strategies.length * outlierDetectionModes.length, 0);

    const results = []
    const logs = []
    for (let strategy of strategies) {
        let result
        for (let outlierDetectionMode of outlierDetectionModes) {
            const options = {
                fetchEventsStrategy: strategy,
                outlierDetection: outlierDetectionMode,
            }
            try {
                const price = await twaper.calculateLpPrice(chainId, lp, routes0, routes1, toBlocks, options)
                result = price.toString()

            }
            catch (e) {
                if (e.error == 'FUSE_TRIGGERED') {
                    result = e.error
                    logs.push({ index: results.length, logFile: e.logFile })
                }
                else result = e
            }
            results.push({ strategy, odm: outlierDetectionMode, result })
            progressBar.increment();
        }
    }
    progressBar.stop()
    console.table(results)
    if (logs.length > 0) {
        console.log('Loged errors can be found here:')
        logs.forEach((log) => console.log('    Test No.', log.index, '\n        ', log.logFile))
    }
}

module.exports = {
    runLpTest
}