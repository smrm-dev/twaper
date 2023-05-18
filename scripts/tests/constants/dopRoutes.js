const { fusePriceTolerance, halfHourMinutes, dayMinutes, CHAINS, validPriceGap } = require('./constants')

const dopBusdPancake = "0xb694ec7C2a7C433E69200b1dA3EBc86907B4578B"
const dopBusdTwindex = "0xC789F6C658809eED4d1769a46fc7BCe5dbB8316E"

const dopPancakeRoute = {
    dex: "Pancake",
    path: [
        {
            address: dopBusdPancake,
            reversed: false,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        },
    ],
    chainId: CHAINS.bsc,
    abiStyle: "UniV2",
    weight: 1,
}

const dopTwindexRoute = {
    dex: "Twindex",
    path: [
        {
            address: dopBusdTwindex,
            reversed: false,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        },

    ],
    chainId: CHAINS.bsc,
    abiStyle: "UniV2",
    weight: 1,
}

const dopRoutes = {
    validPriceGap: validPriceGap,
    routes: [dopPancakeRoute, dopTwindexRoute]
}

module.exports = {
    dopBusdPancake,
    dopBusdTwindex,
    dopRoutes,
}