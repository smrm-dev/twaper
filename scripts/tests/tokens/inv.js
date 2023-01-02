require('dotenv').config({ path: './.env' })
const { invRoutes } = require('../constants/invRoutes')
const { runTest } = require('../utils')




const toBlocks = {
    1: 14506359
}

async function main() {
    await runTest([invRoutes.validPriceGap, invRoutes.routes, toBlocks], 'token')
}

main().catch((error) => console.log(error))