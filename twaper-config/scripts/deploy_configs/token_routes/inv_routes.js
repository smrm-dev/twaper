const { CHAINS, fusePriceTolerance, dayMinutes, halfHourMinutes } = require('../constants')

const invWeth = "0x328dfd0139e26cb0fef7b0742b49b0fe4325f821"
const WethUsdc = "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0"

const invSushiRoute = [
    "Sushi", // dex
    [invWeth, WethUsdc], // path
    {
        chainId: CHAINS.mainnet,
        abiStyle: "UniV2",
        reversed: [false, true],
        fusePriceTolerance: [fusePriceTolerance, fusePriceTolerance],
        minutesToSeed: [halfHourMinutes, halfHourMinutes],
        minutesToFuse: [dayMinutes, dayMinutes],
        weight: 1,
        isActive: true,
    } // config
]

const invRoutes = [invSushiRoute]

module.exports = {
    invRoutes,
}
