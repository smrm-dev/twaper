const { CHAINS, fusePriceTolerance, dayMinutes, halfHourMinutes } = require('../constants')

const sellcWbnbPancake = "0x358EfC593134f99833C66894cCeCD41F550051b6"
const wbnbUsdtPancake = "0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE"

const sellcPancakeRoute = [
    "Pancake",
    [sellcWbnbPancake, wbnbUsdtPancake], // path
    {
        chainId: CHAINS.bsc,
        abiStyle: "UniV2",
        reversed: [false, true],
        fusePriceTolerance: [fusePriceTolerance, fusePriceTolerance],
        minutesToSeed: [halfHourMinutes, halfHourMinutes],
        minutesToFuse: [dayMinutes, dayMinutes],
        weight: 1,
        isActive: true,
    }, // config
]

const sellcRoutes = [sellcPancakeRoute]

module.exports = {
    sellcRoutes,
}