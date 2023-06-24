const { invRoutes } = require('./inv_routes')
const { dopRoutes } = require('./dop_routes')
const { sellcRoutes } = require('./sellc_routes')
const { wavaxRoutes, wavaxUsdcTraderJoe } = require('./wavax_routes')
const { legacyDeiRoutes, legacyDeiUsdcSolidly } = require('./legacy_dei_routes')

module.exports = {
    invRoutes,
    dopRoutes,
    sellcRoutes,
    wavaxUsdcTraderJoe,
    wavaxRoutes,
    legacyDeiRoutes,
    legacyDeiUsdcSolidly,
}