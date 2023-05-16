const { fusePriceTolerance, halfHourMinutes, dayMinutes, CHAINS, validPriceGap } = require('./constants')

const wethUsdcUniV2 = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc"
const wethUsdcSushi = "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0"

const wethUniV2Route = {
    dex: "UniV2",
    path: [
        {
            address: wethUsdcUniV2,
            reversed: true,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        }

    ],
    chainId: CHAINS.mainnet,
    abiStyle: "UniV2",
    weight: 1,
}

const wethSushiRoute = {
    dex: "Sushi",
    path: [
        {
            address: wethUsdcSushi,
            reversed: true,
            fusePriceTolerance: fusePriceTolerance,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
        },
    ],
    chainId: CHAINS.mainnet,
    abiStyle: "UniV2",
    weight: 1,
}

const wethRoutes = {
    validPriceGap: validPriceGap,
    routes: [wethUniV2Route, wethSushiRoute]
}

module.exports = {
    wethUsdcUniV2,
    wethUsdcSushi,
    wethUniV2Route,
    wethSushiRoute,
    wethRoutes,
}