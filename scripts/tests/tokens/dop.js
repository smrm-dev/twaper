require('dotenv').config({ path: './.env' })
const { dopRoutes } = require('../constants/dopRoutes')
const { runTest } = require('../utils')


const toBlocks = {
    56: 12886417
}

async function main() {
    const logInfo = {
        description: 'DOP',
        fileNamePrefix: 'DOP_' + Date.now(),
    }
    await runTest([dopRoutes.validPriceGap, dopRoutes.routes, toBlocks], 'token', logInfo)
}

main().catch((error) => console.log(error))