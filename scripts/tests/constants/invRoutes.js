const { fusePriceTolerance, halfHourMinutes, dayMinutes, CHAINS, validPriceGap } = require('./constants')

const invWethSushi = "0x328dfd0139e26cb0fef7b0742b49b0fe4325f821"
const wethUsdcSushi = "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0"
const invWethUniV2 = "0x73E02EAAb68a41Ea63bdae9Dbd4b7678827B2352"
const wethUsdcUniV2 = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc"

const invSushiRoute = {
    dex: "Sushi",
    path: [
        {
            address: invWethSushi,
            reversed: false,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        },
        {
            address: wethUsdcSushi,
            reversed: true,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        }

    ],
    chainId: 1,
    abiStyle: "UniV2",
    weight: 1,
}

const invUniV2Route = {
    dex: "UniV2",
    path: [
        {
            address: invWethUniV2,
            reversed: false,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        },
        {
            address: wethUsdcUniV2,
            reversed: true,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        }

    ],
    chainId: 1,
    abiStyle: "UniV2",
    weight: 1,
}

const invRoutes = {
    validPriceGap: validPriceGap,
    routes: [invSushiRoute, invUniV2Route]
}

module.exports = {
    invWethSushi,
    invRoutes,
}