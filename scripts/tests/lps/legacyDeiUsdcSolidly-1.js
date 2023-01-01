require('dotenv').config({ path: './.env' })
const { CHAINS } = require('../constants/constants')
const { legacyDeiUsdcSolidly, legacyDeiRoutes } = require('../constants/legacyDeiRoutes')
const { usdcRoutes } = require('../constants/usdcRoutes')
const { runLpTest } = require('../utils')


const toBlocks = {
    250: 33466614
}

async function main() {
    await runLpTest(CHAINS.fantom, legacyDeiUsdcSolidly, legacyDeiRoutes, usdcRoutes, toBlocks)
}

main().catch((error) => console.log(error))