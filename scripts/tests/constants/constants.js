const validPriceGap = BigInt(0.05e18)
const fusePriceTolerance = BigInt(0.3e18)
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
    validPriceGap,
    fusePriceTolerance,
    halfHourMinutes,
    dayMinutes,
    CHAINS,
    strategies,
    outlierDetectionModes
}
