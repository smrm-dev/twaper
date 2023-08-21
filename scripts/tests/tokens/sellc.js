require('dotenv').config({ path: './.env' })
const { sellcRoutes } = require('../constants/sellcRoutes')
const { runTest } = require('../utils')


const toBlocks = {
    56: 28168035
}

async function main() {
    const logInfo = {
        description: 'SELLC',
        fileNamePrefix: 'SELLC_' + Date.now(),
    }
    await runTest([sellcRoutes.validTickGap, sellcRoutes.routes, toBlocks], 'token', logInfo)
}

main().catch((error) => console.log(error))