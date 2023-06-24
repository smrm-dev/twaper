const { CHAINS, fusePriceTolerance, dayMinutes, halfHourMinutes } = require('../constants')

const wavaxUsdcTraderJoe = "0xf4003F4efBE8691B60249E6afbD307aBE7758adb"

const wavaxTraderJoeRoute = [
    "UniV2",
    [wavaxUsdcTraderJoe], // path
    {
        chainId: CHAINS.avax,
        abiStyle: "UniV2",
        reversed: [false],
        fusePriceTolerance: [fusePriceTolerance],
        minutesToSeed: [halfHourMinutes],
        minutesToFuse: [dayMinutes],
        weight: 1,
        isActive: true,
    }, // config
]

const wavaxRoutes = [wavaxTraderJoeRoute]

module.exports = {
    wavaxUsdcTraderJoe,
    wavaxRoutes,
}