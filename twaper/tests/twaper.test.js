require('dotenv').config({ path: './tests/.env' })
require('../utils/global')
const assert = require('assert')

const { ethGetBlockNumber } = MuonAppUtils

const { dynamicExtend } = require('../utils/utils')
const Twaper = dynamicExtend(
    class { },
    require('../apps/twaper')
)
const app = new Twaper()

const RED = "\x1b[31m"
const GREEN = "\x1b[32m"
const BLUE = "\x1b[34m"
const CYAN = "\x1b[36m"
function injectColor(color, text) {
    return color + text
}

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

describe('Twaper app test', () => {
    it('Test calculatePrice', async () => {
        const validPriceGap = BigInt(0.05e18)
        const routes = [deusSpiritRoute]
        const toBlocks = {
            250: await ethGetBlockNumber(250)
        }

        const { price, removedPrices } = await app.calculatePrice(validPriceGap, routes, toBlocks)
    })

    it('Test calculateLpPrice', async () => {
        assert(false)
    })

    it('Test validateToBlocks', async () => {
        assert(false)
    })
})