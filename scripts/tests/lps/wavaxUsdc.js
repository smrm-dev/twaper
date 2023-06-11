
require('dotenv').config({ path: './.env' })
const { CHAINS } = require('../constants/constants')
const { wavaxUsdcTraderJoe, wavaxRoutes } = require('../constants/wavaxRoutes')
const { usdcRoutes } = require('../constants/usdcRoutes')
const { runTest } = require('../utils')

const toBlocks = {
    [CHAINS.avax]: 19613453,
}

// price of hack : (1e26 / 32701350550 = 3057977677316449) * 1e-8

async function main() {
    const timestamp = Date.now()
    const logInfo = {
        description: 'WAVAX-USDC-TraderJoe',
        fileNamePrefix: `WAVAX-USDC-TraderJoe_${timestamp}`,
        token0: {
            description: 'WAVAX',
            fileNamePrefix: `WAVAX_${timestamp}`
        },
        token1: {
            description: 'USDC',
            fileNamePrefix: `USDC_${timestamp}`
        },
    }
    await runTest([CHAINS.avax, wavaxUsdcTraderJoe, wavaxRoutes, usdcRoutes, toBlocks], 'lp', logInfo)
}

main().catch((error) => console.log(error))