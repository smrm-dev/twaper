const { fusePriceTolerance, halfHourMinutes, dayMinutes, CHAINS, validPriceGap } = require('./constants')

const sellcWbnbPancake = "0x358EfC593134f99833C66894cCeCD41F550051b6"
const wbnbUsdtPancake = "0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE"

const sellcPancakeRoute = {
    dex: "Pancake",
    path: [
        {
            address: sellcWbnbPancake,
            reversed: false,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        },
        {
            address: wbnbUsdtPancake,
            reversed: true,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        },
    ],
    chainId: CHAINS.bsc,
    abiStyle: "UniV2",
    weight: 1,
}

const sellcRoutes = {
    validPriceGap: validPriceGap,
    routes: [sellcPancakeRoute]
}

module.exports = {
    sellcWbnbPancake,
    sellcRoutes,
}