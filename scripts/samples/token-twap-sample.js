require('dotenv').config({ path: './.env' })
require("twaper")
const { twaper } = utils

const deusWftmSpirit = "0x2599Eba5fD1e49F294C76D034557948034d6C96E"
const wftmUsdcSpirit = "0xe7E90f5a767406efF87Fdad7EB07ef407922EC1D"
const fusePriceTolerance = BigInt(0.3e18)
const halfHourMinutes = 30
const dayMinutes = 1440

const deusSpiritRoute = {
    dex: "Spirit", // dex
    path: [
        {
            address: deusWftmSpirit,
            reversed: true,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
            fusePriceTolerance: fusePriceTolerance,
        },
        {
            address: wftmUsdcSpirit,
            reversed: true,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
            fusePriceTolerance: fusePriceTolerance,
        },
    ], // path
    chainId: 250,
    abiStyle: "UniV2",
    weight: 1,
}

const validPriceGap = BigInt(0.05e18)
const routes = [deusSpiritRoute]
const toBlocks = {
    250: 51510743
}


async function main() {
    const { price, removedPrices } = await twaper.calculatePrice(validPriceGap, routes, toBlocks)
    console.log(price.toString())
}

main().catch((error) => console.log(error))