const { ethCall, ethGetBlock, ethGetBlockNumber, BN } = MuonAppUtils
const PriceFeed = require('./price_feed')

const {
    CHAINS,
    Q112,
} = PriceFeed

const blocksToAvoidReorg = {
    [CHAINS.mainnet]: 3,
    [CHAINS.fantom]: 26,
    [CHAINS.polygon]: 15,
}

const CONFIG_ABI = [{ "inputs": [], "name": "getRoutes", "outputs": [{ "internalType": "uint256", "name": "validPriceGap_", "type": "uint256" }, { "components": [{ "internalType": "uint256", "name": "index", "type": "uint256" }, { "internalType": "string", "name": "dex", "type": "string" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "components": [{ "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "internalType": "string", "name": "abiStyle", "type": "string" }, { "internalType": "bool[]", "name": "reversed", "type": "bool[]" }, { "internalType": "uint256[]", "name": "fusePriceTolerance", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "minutesToSeed", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "minutesToFuse", "type": "uint256[]" }, { "internalType": "uint256", "name": "weight", "type": "uint256" }, { "internalType": "bool", "name": "isActive", "type": "bool" }], "internalType": "struct IConfig.Config", "name": "config", "type": "tuple" }], "internalType": "struct IConfig.Route[]", "name": "routes_", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }]

module.exports = {
    ...PriceFeed,

    APP_NAME: 'token_price_feed',

    getRoute: async function (config) {
        let routes = await ethCall(config, 'getRoutes', [], CONFIG_ABI, CHAINS.fantom)
        const chainIds = new Set()
        routes = {
            validPriceGap: routes.validPriceGap_,
            routes: routes.routes_.map((route) => {
                chainIds.add(route.config.chainId)
                return {
                    chainId: route.config.chainId,
                    abiStyle: route.config.abiStyle,
                    path: route.path.map((address, i) => {
                        return {
                            address: address,
                            reversed: route.config.reversed[i],
                            fusePriceTolerance: route.config.fusePriceTolerance[i],
                            minutesToSeed: route.config.minutesToSeed[i],
                            minutesToFuse: route.config.minutesToFuse[i]
                        }
                    }),
                    weight: route.config.weight
                }
            })
        }

        return { routes, chainIds }
    },

    getTokenPairPrice: async function (chainId, abiStyle, pair, toBlock) {
        const pairPrice = await this.calculatePairPrice(chainId, abiStyle, pair, toBlock)
        return { tokenPairPrice: new BN(pair.reversed ? new BN(pairPrice.price1) : new BN(pairPrice.price0)), removed: pairPrice.removed }
    },

    calculatePrice: async function (validPriceGap, routes, toBlocks) {
        let sumTokenPrice = new BN(0)
        let sumWeights = new BN(0)
        let prices = []
        const removedPrices = []

        const promises = []
        for (let [i, route] of routes.entries()) {
            for (let pair of route.path) {
                promises.push(this.getTokenPairPrice(route.chainId, route.abiStyle, pair, toBlocks[route.chainId]))
            }
        }

        let result = await Promise.all(promises)

        for (let route of routes) {
            let price = Q112
            const routeRemovedPrices = []
            for (let pair of route.path) {
                price = price.mul(result[0].tokenPairPrice).div(Q112)
                routeRemovedPrices.push(result[0].removed)
                result = result.slice(1)
            }

            sumTokenPrice = sumTokenPrice.add(price.mul(new BN(route.weight)))
            sumWeights = sumWeights.add(new BN(route.weight))
            prices.push(price)
            removedPrices.push(routeRemovedPrices)
        }

        if (prices.length > 1) {
            let [minPrice, maxPrice] = [BN.min(...prices), BN.max(...prices)]
            if (!this.isPriceToleranceOk(maxPrice, minPrice, validPriceGap).isOk)
                throw { message: `High price gap between route prices (${minPrice}, ${maxPrice})` }
        }
        return { price: sumTokenPrice.div(sumWeights), removedPrices }
    },

    getReliableBlock: async function (chainId) {
        const latestBlock = await ethGetBlockNumber(chainId)
        const reliableBlock = latestBlock - blocksToAvoidReorg[chainId]
        return reliableBlock
    },

    prepareToBlocks: async function (chainIds) {
        const toBlocks = {}
        for (let chainId of chainIds) {
            // consider a few blocks before the current block as toBlock to avoid reorg
            toBlocks[chainId] = await this.getReliableBlock(chainId)
        }

        return toBlocks
    },

    getEarliestBlockTimestamp: async function (chainIds, toBlocks) {
        const promises = []
        for (const chainId of chainIds) {
            promises.push(ethGetBlock(chainId, toBlocks[chainId]))
        }

        const blocks = await Promise.all(promises)
        const timestamps = []
        blocks.forEach((block) => {
            timestamps.push(block.timestamp)
        })
        return Math.min(...timestamps)
    },

    onRequest: async function (request) {
        let {
            method,
            data: { params }
        } = request

        switch (method) {
            case 'price':

                let { config, toBlocks } = params

                // get token route for calculating price
                const { routes, chainIds } = await this.getRoute(config)
                if (!routes) throw { message: 'Invalid config' }

                // prepare toBlocks 
                if (!toBlocks) {
                    if (!request.data.result)
                        toBlocks = await this.prepareToBlocks(chainIds)
                    else
                        toBlocks = request.data.result.toBlocks
                }
                else toBlocks = JSON.parse(toBlocks)

                // calculate price using the given route
                const { price, removedPrices } = await this.calculatePrice(routes.validPriceGap, routes.routes, toBlocks)

                // get earliest block timestamp
                const timestamp = await this.getEarliestBlockTimestamp(chainIds, toBlocks)

                return {
                    config,
                    routes,
                    price: price.toString(),
                    removedPrices,
                    toBlocks,
                    timestamp
                }

            case 'lp_price': {
                let { pair, config0, config1, toBlocks, chain } = params

                const { K, totalSupply } = await this.getLpTotalSupply(pair, chain)

                // get routes for each config
                let
                    [
                        { routes: routes0, chainIds: chainIds0 },
                        { routes: routes1, chainIds: chainIds1 }
                    ]
                        = await Promise.all([this.getRoute(config0), this.getRoute(config1)])

                if (!routes0.routes || !routes1.routes) throw { message: 'Invalid config' }

                const chainIds = new Set([...chainIds0, ...chainIds1])

                // prepare toBlocks 
                if (!toBlocks) {
                    if (!request.data.result)
                        toBlocks = await this.prepareToBlocks(chainIds)
                    else
                        toBlocks = request.data.result.toBlocks
                }
                else toBlocks = JSON.parse(toBlocks)

                // prepare promises for calculating each config price
                const promises = [
                    this.calculatePrice(routes0.validPriceGap, routes0.routes, toBlocks),
                    this.calculatePrice(routes1.validPriceGap, routes1.routes, toBlocks)
                ]

                let [price0, price1] = await Promise.all(promises)

                // calculate lp token price based on price0 & price1 & K & totalSupply
                const price = await this.calculateLpPrice(price0.price, price1.price, K, totalSupply)

                // get earliest block timestamp
                const timestamp = await this.getEarliestBlockTimestamp(chainIds, toBlocks)

                return {
                    chainId: CHAINS[chain],
                    pair,
                    price: price.toString(),
                    config0,
                    config1,
                    toBlocks,
                    timestamp
                }
            }

            default:
                throw { message: `Unknown method ${params}` }
        }
    },

    /**
     * List of the parameters that need to be signed. 
     * APP_ID, reqId will be added by the
     * Muon Core and [APP_ID, reqId, … signParams]
     * should be verified on chain.
     */
    signParams: function (request, result) {
        let { method } = request
        switch (method) {
            case 'price': {

                let { config, price, timestamp } = result

                return [
                    { type: 'address', value: config },
                    { type: 'uint256', value: price },
                    { type: 'uint256', value: timestamp }
                ]
            }

            case 'lp_price': {
                let { chainId, pair, price, config0, config1, timestamp } = result

                return [
                    { type: 'uint256', value: chainId },
                    { type: 'address', value: pair },
                    { type: 'uint256', value: price },
                    { type: 'address', value: config0 },
                    { type: 'address', value: config1 },
                    { type: 'uint256', value: timestamp }
                ]
            }

            default:
                break
        }
    }
}
