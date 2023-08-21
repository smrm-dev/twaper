
require('dotenv').config({ path: './.env' })
const { CHAINS } = require('../constants/constants')
const { invWethSushi, invRoutes } = require('../constants/invRoutes')
const { wethRoutes } = require('../constants/wethRoutes')
const { runTest } = require('../utils')

const toBlocks = {
    1: 14506359,
}


async function main() {
    const timestamp = Date.now()
    const logInfo = {
        description: 'INV-WETH-UniV2',
        fileNamePrefix: `INV-WETH-UniV2_${timestamp}`,
        token0: {
            description: 'INV',
            fileNamePrefix: `INV_${timestamp}`
        },
        token1: {
            description: 'ETH',
            fileNamePrefix: `ETH_${timestamp}`
        },
    }
    await runTest([CHAINS.mainnet, invWethSushi, invRoutes, wethRoutes, toBlocks], 'lp', logInfo)
}

main().catch((error) => console.log(error))