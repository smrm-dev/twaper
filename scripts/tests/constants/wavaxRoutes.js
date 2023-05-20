const { fusePriceTolerance, halfHourMinutes, dayMinutes, CHAINS, validPriceGap } = require('./constants')

const wavaxUsdcTraderJoe = "0xf4003F4efBE8691B60249E6afbD307aBE7758adb"

const wavaxTraderJoeRoute = {
    dex: "UniV2",
    path: [
        {
            address: wavaxUsdcTraderJoe,
            reversed: false,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        }

    ],
    chainId: CHAINS.avax,
    abiStyle: "UniV2",
    weight: 1,
}

const wavaxRoutes = {
    validPriceGap: validPriceGap,
    routes: [wavaxTraderJoeRoute]
}

module.exports = {
    wavaxUsdcTraderJoe,
    wavaxTraderJoeRoute,
    wavaxRoutes,
}