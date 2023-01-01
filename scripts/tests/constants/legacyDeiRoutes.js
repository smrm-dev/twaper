const { fusePriceTolerance, halfHourMinutes, dayMinutes, CHAINS, validPriceGap } = require('./constants')

const legacyDeiUsdcSolidly = "0x5821573d8F04947952e76d94f3ABC6d7b43bF8d0"
const legacyDeiUsdcSpooky = "0xD343b8361Ce32A9e570C1fC8D4244d32848df88B"
const legacyDeiUsdcSpirit = "0x8eFD36aA4Afa9F4E157bec759F1744A7FeBaEA0e"

const legacyDeiSolidlyRoute = {
    dex: "Solidly",
    path: [
        {
            address: legacyDeiUsdcSolidly,
            reversed: true,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        }

    ],
    chainId: CHAINS.fantom,
    abiStyle: "Solidly",
    weight: 1,
}

const legacyDeiSpookyRoute = {
    dex: "Spooky",
    path: [
        {
            address: legacyDeiUsdcSpooky,
            reversed: true,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        },
    ],
    chainId: CHAINS.fantom,
    abiStyle: "UniV2",
    weight: 1,
}

const legacyDeiSpiritRoute = {
    dex: "Spirit",
    path: [
        {
            address: legacyDeiUsdcSpirit,
            reversed: true,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        },
    ],
    chainId: CHAINS.fantom,
    abiStyle: "UniV2",
    weight: 1,
}


const legacyDeiRoutes = {
    validPriceGap: validPriceGap,
    routes: [legacyDeiSolidlyRoute, legacyDeiSpiritRoute, legacyDeiSpookyRoute]
}

module.exports = {
    legacyDeiUsdcSolidly,
    legacyDeiUsdcSpirit,
    legacyDeiUsdcSpooky,
    legacyDeiRoutes,
}