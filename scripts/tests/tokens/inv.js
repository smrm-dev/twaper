require('dotenv').config({ path: './.env' })
const { invRoutes } = require('../constants/invRoutes')
const { runTest } = require('../utils')




const toBlocks = {
    1: 14506359
}

async function main() {
    const logInfo = {
        description: 'INV',
        fileNamePrefix: 'INV_' + Date.now(),
    }
    await runTest([invRoutes.validPriceGap, invRoutes.routes, toBlocks], 'token', logInfo)
}

main().catch((error) => console.log(error))