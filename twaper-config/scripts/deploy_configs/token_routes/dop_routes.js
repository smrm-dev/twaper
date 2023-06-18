const { CHAINS, fusePriceTolerance, dayMinutes, halfHourMinutes } = require('../constants')

const dopBusdPancake = "0xb694ec7C2a7C433E69200b1dA3EBc86907B4578B"
const dopBusdTwindex = "0xC789F6C658809eED4d1769a46fc7BCe5dbB8316E"

const dopPancakeRoute = [
    "Pancake",
    [dopBusdPancake], // path
    {
        chainId: CHAINS.bsc,
        abiStyle: "UniV2",
        reversed: [false],
        fusePriceTolerance: [fusePriceTolerance],
        minutesToSeed: [halfHourMinutes],
        minutesToFuse: [dayMinutes],
        weight: 1,
        isActive: true,
    }, // config
]

const dopTwindexRoute = [
    "Twindex",
    [dopBusdTwindex], // path
    {
        chainId: CHAINS.bsc,
        abiStyle: "UniV2",
        reversed: [false],
        fusePriceTolerance: [fusePriceTolerance],
        minutesToSeed: [halfHourMinutes],
        minutesToFuse: [dayMinutes],
        weight: 1,
        isActive: true,
    }, // config
]

const dopRoutes = [dopPancakeRoute, dopTwindexRoute]

module.exports = {
    dopRoutes,
}