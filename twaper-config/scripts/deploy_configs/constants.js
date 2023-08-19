const validTickGap = BigInt(0.05e18)
const fuseTickTolerance = BigInt(0.3e18)
const dayMinutes = 1440
const halfHourMinutes = 30
const configFactoryAddress = ""
const zeroAddress = "0x0000000000000000000000000000000000000000"

const CHAINS = {
    fantom: 250,
    mainnet: 1,
    polygon: 137,
    bsc: 56,
    avax: 43114,
}

module.exports = {
    CHAINS,
    validTickGap,
    fuseTickTolerance,
    dayMinutes,
    halfHourMinutes,
    configFactoryAddress,
    zeroAddress,
}