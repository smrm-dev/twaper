const { CHAINS, fusePriceTolerance, dayMinutes, halfHourMinutes } = require('../constants')

const invWethSushi = "0x328dfd0139e26cb0fef7b0742b49b0fe4325f821"
const WethUsdcSushi = "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0"
const invWethUniV2 = "0x73E02EAAb68a41Ea63bdae9Dbd4b7678827B2352"
const wethUsdcUniV2 = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc"

const invSushiRoute = [
    "Sushi", // dex
    [invWethSushi, WethUsdcSushi], // path
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

const invUniV2Route = [
    "UniV2",
    [invWethUniV2, wethUsdcUniV2],
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

const invRoutes = [invSushiRoute, invUniV2Route]

module.exports = {
    invRoutes,
}
