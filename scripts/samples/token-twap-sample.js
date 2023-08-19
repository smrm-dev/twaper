require('dotenv').config({ path: './.env' })
require("twaper")
const { twaper } = utils

const deusWftmSpirit = "0x2599Eba5fD1e49F294C76D034557948034d6C96E"
const wftmUsdcSpirit = "0xe7E90f5a767406efF87Fdad7EB07ef407922EC1D"
const fuseTickTolerance = 2624 // 30%
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
            fuseTickTolerance,
        },
        {
            address: wftmUsdcSpirit,
            reversed: true,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
            fuseTickTolerance,
        },
    ], // path
    chainId: 250,
    abiStyle: "UniV2",
    weight: 1,
}

const validTickGap = 488 // 5% 
const routes = [deusSpiritRoute]
const toBlocks = {
    250: 51510743
}


async function main() {
    const start = Date.now()
    const { tick, removedTicks } = await twaper.calculateTick(validTickGap, routes, toBlocks)
    const end = Date.now()
    console.log('result: ', tick)
    console.log('responeTime: ', (end - start) / 1000)
}

main().catch((error) => console.log(error))