const { fusePriceTolerance, halfHourMinutes, dayMinutes, CHAINS, validPriceGap } = require('./constants')

const invWethSushi = "0x328dfd0139e26cb0fef7b0742b49b0fe4325f821"
const wethUsdcSushi = "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0"

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

const invRoutes = {
    validPriceGap: validPriceGap,
    routes: [invSushiRoute]
}

module.exports = {
    invWethSushi,
    invRoutes,
}