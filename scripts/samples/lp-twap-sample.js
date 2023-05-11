require('dotenv').config({ path: './.env' })
require("twaper")
const { twaper } = utils

const legacyDeiUsdcSolidly = "0x5821573d8F04947952e76d94f3ABC6d7b43bF8d0"
const fusePriceTolerance = BigInt(0.3e18)
const halfHourMinutes = 30
const dayMinutes = 1440

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
    chainId: 250,
    abiStyle: "Solidly",
    weight: 1,
}

const validPriceGap = BigInt(0.05e18)

const legacyDeiRoutes = {
    validPriceGap: validPriceGap,
    routes: [legacyDeiSolidlyRoute]
}

const usdcRoutes = {
    validPriceGap: BigInt(0),
    routes: []
}

const toBlocks = {
    250: 33466614
}

async function main() {
    const start = Date.now()
    const price = await twaper.calculateLpPrice(250, legacyDeiUsdcSolidly, legacyDeiRoutes, usdcRoutes, toBlocks)
    const end = Date.now()
    console.log('result: ', price.toString())
    console.log('responeTime: ', (end - start) / 1000)
}

main().catch((error) => console.log(error))