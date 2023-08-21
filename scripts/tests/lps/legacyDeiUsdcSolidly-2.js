require('dotenv').config({ path: './.env' })
const { CHAINS } = require('../constants/constants')
const { legacyDeiUsdcSolidly, legacyDeiRoutes } = require('../constants/legacyDeiRoutes')
const { usdcRoutes } = require('../constants/usdcRoutes')
const { runTest } = require('../utils')


const toBlocks = {
    250: 37115797
}

async function main() {
    const timestamp = Date.now()
    const logInfo = {
        description: 'legacyDEI-USDC-Solidly',
        fileNamePrefix: `legacyDEI-USDC-Solidly_${timestamp}`,
        token0: {
            description: 'legacyDEI',
            fileNamePrefix: `legacyDEI_${timestamp}`
        },
        token1: {
            description: 'USDC',
            fileNamePrefix: `USDC_${timestamp}`
        },
    }
    await runTest([CHAINS.fantom, legacyDeiUsdcSolidly, legacyDeiRoutes, usdcRoutes, toBlocks], 'lp', logInfo)
}

main().catch((error) => console.log(error))