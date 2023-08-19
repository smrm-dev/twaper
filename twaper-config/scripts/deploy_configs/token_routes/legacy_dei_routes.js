const { CHAINS, fuseTickTolerance, dayMinutes, halfHourMinutes } = require('../constants')

const legacyDeiUsdcSolidly = "0x5821573d8F04947952e76d94f3ABC6d7b43bF8d0"
const legacyDeiUsdcSpooky = "0xD343b8361Ce32A9e570C1fC8D4244d32848df88B"
const legacyDeiUsdcSpirit = "0x8eFD36aA4Afa9F4E157bec759F1744A7FeBaEA0e"

const legacyDeiSpookyRoute = [
    "Spooky", // dex
    [legacyDeiUsdcSpooky], // path
    {
        chainId: CHAINS.fantom,
        abiStyle: "UniV2",
        reversed: [true],
        fuseTickTolerance: [fuseTickTolerance],
        minutesToSeed: [halfHourMinutes],
        minutesToFuse: [dayMinutes],
        weight: 1,
        isActive: true,
    } // config
]

const legacyDeiSpiritRoute = [
    "Spirit", // dex
    [legacyDeiUsdcSpirit], // path
    {
        chainId: CHAINS.fantom,
        abiStyle: "UniV2",
        reversed: [true],
        fuseTickTolerance: [fuseTickTolerance],
        minutesToSeed: [halfHourMinutes],
        minutesToFuse: [dayMinutes],
        weight: 1,
        isActive: true,
    } // config
]

const legacyDeiSolidlyRoute = [
    "Solidly", // dex
    [legacyDeiUsdcSolidly], // path
    {
        chainId: CHAINS.fantom,
        abiStyle: "Solidly",
        reversed: [true],
        fuseTickTolerance: [fuseTickTolerance],
        minutesToSeed: [halfHourMinutes],
        minutesToFuse: [dayMinutes],
        weight: 1,
        isActive: true,
    } // config

]

const legacyDeiRoutes = [legacyDeiSolidlyRoute, legacyDeiSpiritRoute, legacyDeiSpookyRoute]

module.exports = {
    legacyDeiUsdcSolidly,
    legacyDeiRoutes,
}