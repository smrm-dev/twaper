const validTickGap = 488
const fuseTickTolerance = 2624
const halfHourMinutes = 30
const dayMinutes = 1440

const CHAINS = {
    fantom: 250,
    mainnet: 1,
    bsc: 56,
    avax: 43114,
}

const strategies = ['nop', 'max', 'min']
const outlierDetectionModes = ['on', 'off']

module.exports = {
    validTickGap,
    fuseTickTolerance,
    halfHourMinutes,
    dayMinutes,
    CHAINS,
    strategies,
    outlierDetectionModes
}
