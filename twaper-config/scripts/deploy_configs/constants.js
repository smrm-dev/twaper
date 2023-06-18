const validPriceGap = BigInt(0.05e18)
const fusePriceTolerance = BigInt(0.3e18)
const dayMinutes = 1440
const halfHourMinutes = 30
const configFactoryAddress = ""

const CHAINS = {
    fantom: 250,
    mainnet: 1,
    polygon: 137,
    bsc: 56,
}

module.exports = {
    CHAINS,
    validPriceGap,
    fusePriceTolerance,
    dayMinutes,
    halfHourMinutes,
    configFactoryAddress,
}