const { toBaseUnit, BN, Web3 } = MuonAppUtils

const HttpProvider = Web3.providers.HttpProvider

const CHAINS = {
    mainnet: 1,
    fantom: 250,
    polygon: 137,
    bsc: 56,
    avax: 43114,
}

const networksWeb3 = {
    [CHAINS.mainnet]: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_ETH || "https://rpc.ankr.com/eth")),
    [CHAINS.fantom]: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_FTM || "https://rpc.ankr.com/fantom")),
    [CHAINS.polygon]: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_POLYGON || "https://rpc.ankr.com/polygon")),
    [CHAINS.bsc]: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_BSC || "https://1rpc.io/bnb")),
    [CHAINS.avax]: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_AVAX || "https://rpc.ankr.com/avalanche")),
}

const networksBlocksPerMinute = {
    [CHAINS.mainnet]: 5,
    [CHAINS.fantom]: 52,
    [CHAINS.polygon]: 29,
    [CHAINS.bsc]: 12,
    [CHAINS.avax]: 55,
}

const THRESHOLD = 2
const FUSE_PRICE_TOLERANCE = BigInt(0.3e18)
const Q112 = new BN(2).pow(new BN(112))
const ETH = new BN(toBaseUnit('1', '18'))

const UNISWAPV2_PAIR_ABI = [{ "constant": true, "inputs": [], "name": "getReserves", "outputs": [{ "internalType": "uint112", "name": "_reserve0", "type": "uint112" }, { "internalType": "uint112", "name": "_reserve1", "type": "uint112" }, { "internalType": "uint32", "name": "_blockTimestampLast", "type": "uint32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint112", "name": "reserve0", "type": "uint112" }, { "indexed": false, "internalType": "uint112", "name": "reserve1", "type": "uint112" }], "name": "Sync", "type": "event" }, { "inputs": [], "name": "price0CumulativeLast", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "price1CumulativeLast", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
const UNISWAPV3_PAIR_ABI = [{ "inputs": [], "name": "slot0", "outputs": [{ "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" }, { "internalType": "int24", "name": "tick", "type": "int24" }, { "internalType": "uint16", "name": "observationIndex", "type": "uint16" }, { "internalType": "uint16", "name": "observationCardinality", "type": "uint16" }, { "internalType": "uint16", "name": "observationCardinalityNext", "type": "uint16" }, { "internalType": "uint8", "name": "feeProtocol", "type": "uint8" }, { "internalType": "bool", "name": "unlocked", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" }, { "indexed": false, "internalType": "int256", "name": "amount0", "type": "int256" }, { "indexed": false, "internalType": "int256", "name": "amount1", "type": "int256" }, { "indexed": false, "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" }, { "indexed": false, "internalType": "uint128", "name": "liquidity", "type": "uint128" }, { "indexed": false, "internalType": "int24", "name": "tick", "type": "int24" }], "name": "Swap", "type": "event" }]
const SOLIDLY_PAIR_ABI = [{ "inputs": [], "name": "observationLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "points", "type": "uint256" }, { "internalType": "uint256", "name": "window", "type": "uint256" }], "name": "sample", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "metadata", "outputs": [{ "internalType": "uint256", "name": "dec0", "type": "uint256" }, { "internalType": "uint256", "name": "dec1", "type": "uint256" }, { "internalType": "uint256", "name": "r0", "type": "uint256" }, { "internalType": "uint256", "name": "r1", "type": "uint256" }, { "internalType": "bool", "name": "st", "type": "bool" }, { "internalType": "address", "name": "t0", "type": "address" }, { "internalType": "address", "name": "t1", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "reserve0", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "reserve1", "type": "uint256" }], "name": "Sync", "type": "event" }, { "inputs": [], "name": "getReserves", "outputs": [{ "internalType": "uint256", "name": "_reserve0", "type": "uint256" }, { "internalType": "uint256", "name": "_reserve1", "type": "uint256" }, { "internalType": "uint256", "name": "_blockTimestampLast", "type": "uint256" }], "stateMutability": "view", "type": "function" }]

const ABIS = {
    UniV2: UNISWAPV2_PAIR_ABI,
    Solidly: SOLIDLY_PAIR_ABI,
}

const makeBatchRequest = function (w3, calls) {
    let batch = new w3.BatchRequest();

    let promises = calls.map(call => {
        return new Promise((res, rej) => {
            let req = call.req.request(call.block, (err, data) => {
                if (err) rej(err);
                else res(data)
            });
            batch.add(req)
        })
    })
    batch.execute()

    return Promise.all(promises)
}

const calculateLogarithm = function (base, x) {
    var a = Math.log(x);
    var b = Math.log(base);

    return parseInt(a / b);
}

class Pair {
    constructor(chainId, address) {
        this.chainId = chainId
        this.address = address
    }

    async getEvents(seedBlock, toBlock, event, abi) {
        const w3 = networksWeb3[this.chainId]
        const pair = new w3.eth.Contract(abi, this.address)
        const options = {
            fromBlock: seedBlock + 1,
            toBlock: toBlock
        }
        const events = await pair.getPastEvents(event, options)
        let eventsMap = {}
        // {key: event.blockNumber => value: event}
        events.forEach((event) => eventsMap[event.blockNumber] = event)
        return eventsMap
    }
}

class UniV2Pair extends Pair {
    constructor(chainId, address) {
        super(chainId, address)
        this.abi = UNISWAPV2_PAIR_ABI
    }

    calculateInstantPrice(reserve0, reserve1) {
        // multiply reserveA into Q112 for precision in division 
        // reserveA * (2 ** 112) / reserverB
        const price0 = this.calculateLogarithm(1.0001, new BN(reserve1).mul(Q112).div(new BN(reserve0))) - this.calculateLogarithm(1.0001, Q112)
        return price0
    }

    async getSeed(seedBlockNumber) {
        const w3 = networksWeb3[this.chainId]
        const pair = new w3.eth.Contract(this.abi, this.address)
        const { _reserve0, _reserve1 } = await pair.methods.getReserves().call(seedBlockNumber)
        const price0 = this.calculateInstantPrice(_reserve0, _reserve1)
        return { price0: price0, blockNumber: seedBlockNumber }
    }

    createPrices(seed, syncEventsMap, toBlock) {
        let prices = [seed.price0]
        let price = seed.price0
        // fill prices and consider a price for each block between seed and current block
        for (let blockNumber = seed.blockNumber + 1; blockNumber <= toBlock; blockNumber++) {
            // use block event price if there is an event for the block
            // otherwise use last event price
            if (syncEventsMap[blockNumber]) {
                const { reserve0, reserve1 } = syncEventsMap[blockNumber].returnValues
                price = this.calculateInstantPrice(reserve0, reserve1)
            }
            prices.push(price)
        }
        return prices
    }

    async getPrices(seedBlock, toBlock) {
        // get seed price
        const seed = await this.getSeed(seedBlock)
        // get sync events that are emitted after seed block
        const syncEventsMap = await this.getEvents(seedBlock, toBlock, "Sync", this.abi)
        // create an array contains a price for each block mined after seed block 
        const prices = this.createPrices(seed, syncEventsMap, toBlock)

        return prices
    }

    updatePriceCumulativeLasts(_price0CumulativeLast, _price1CumulativeLast, toBlockReserves, toBlockTimestamp) {
        const timestampLast = toBlockTimestamp % 2 ** 32
        if (timestampLast != toBlockReserves._blockTimestampLast) {
            const period = new BN(timestampLast - toBlockReserves._blockTimestampLast)
            const price0CumulativeLast = new BN(_price0CumulativeLast).add(this.calculateInstantPrice(toBlockReserves._reserve0, toBlockReserves._reserve1).mul(period))
            const price1CumulativeLast = new BN(_price1CumulativeLast).add(this.calculateInstantPrice(toBlockReserves._reserve1, toBlockReserves._reserve0).mul(period))
            return { price0CumulativeLast, price1CumulativeLast }
        }
        else return { price0CumulativeLast: _price0CumulativeLast, price1CumulativeLast: _price1CumulativeLast }
    }


    async getFusePrice(fuseBlock, toBlock) {
        const w3 = networksWeb3[this.chainId]
        const pair = new w3.eth.Contract(this.abi, this.address)
        let [
            _price0CumulativeLast,
            _price1CumulativeLast,
            toReserves,
            to,
            _seedPrice0CumulativeLast,
            _seedPrice1CumulativeLast,
            seedReserves,
            seed,
        ] = await makeBatchRequest(w3, [
            // reqs to get priceCumulativeLast of toBlock
            { req: pair.methods.price0CumulativeLast().call, block: toBlock },
            { req: pair.methods.price1CumulativeLast().call, block: toBlock },
            { req: pair.methods.getReserves().call, block: toBlock },
            { req: w3.eth.getBlock, block: toBlock },
            // reqs to get priceCumulativeLast of seedBlock 
            { req: pair.methods.price0CumulativeLast().call, block: fuseBlock },
            { req: pair.methods.price1CumulativeLast().call, block: fuseBlock },
            { req: pair.methods.getReserves().call, block: fuseBlock },
            { req: w3.eth.getBlock, block: fuseBlock },
        ])

        const { price0CumulativeLast, price1CumulativeLast } = this.updatePriceCumulativeLasts(_price0CumulativeLast, _price1CumulativeLast, toReserves, to.timestamp)
        const { price0CumulativeLast: seedPrice0CumulativeLast, price1CumulativeLast: seedPrice1CumulativeLast } = this.updatePriceCumulativeLasts(_seedPrice0CumulativeLast, _seedPrice1CumulativeLast, seedReserves, seed.timestamp)

        const period = new BN(to.timestamp).sub(new BN(seed.timestamp)).abs()

        return {
            price0: new BN(price0CumulativeLast).sub(new BN(seedPrice0CumulativeLast)).div(period),
            price1: new BN(price1CumulativeLast).sub(new BN(seedPrice1CumulativeLast)).div(period),
            blockNumber: fuseBlock
        }
    }
}

class SolidlyPair extends UniV2Pair {
    constructor(chainId, address) {
        super(chainId, address)
        this.abi = SOLIDLY_PAIR_ABI
    }

    async getFusePrice(fuseBlock, toBlock) {
        const w3 = networksWeb3[this.chainId]
        const pair = new w3.eth.Contract(this.abi, this.address)
        let [
            metadata,
            observationLength,
            fuseObservationLength,
        ] = await makeBatchRequest(w3, [
            { req: pair.methods.metadata().call, block: toBlock },
            // reqs to get observationLength of toBlock
            { req: pair.methods.observationLength().call, block: toBlock },
            // reqs to get observationLength of seedBlock 
            { req: pair.methods.observationLength().call, block: fuseBlock },
        ])

        const window = observationLength - fuseObservationLength

        let [price0, price1] = await makeBatchRequest(w3, [
            { req: pair.methods.sample(metadata.t0, metadata.dec0, 1, window).call, block: toBlock },
            { req: pair.methods.sample(metadata.t1, metadata.dec1, 1, window).call, block: toBlock },
        ])

        return {
            price0: new BN(price0[0]).mul(Q112).div(new BN(metadata.dec0)),
            price1: new BN(price1[0]).mul(Q112).div(new BN(metadata.dec1)),
            blockNumber: fuseBlock
        }
    }
}

class UniV3Pair extends Pair {
    constructor(chainId, address) {
        super(chainId, address)
        this.abi = UNISWAPV3_PAIR_ABI
    }

    async getSeed(blockNumber) {
        const w3 = networksWeb3[this.chainId]
        const pair = new w3.eth.Contract(this.abi, this.address)
        const { tick } = await pair.methods.slot0().call(blockNumber)
        return { tick, blockNumber }
    }

    async createPrices(seed, swapEventsMap, toBlock) {
        let ticks = [seed.tick]
        let tick = seed.tick
        // fill ticks and consider a tick for each block between seed and current block
        for (let blockNumber = seed.blockNumber + 1; blockNumber <= toBlock; blockNumber++) {
            // use block event tick if there is an event for the block
            // otherwise use last event tick 
            if (swapEventsMap[blockNumber]) {
                const { tick } = swapEventsMap[blockNumber].returnValues.tick
            }
            ticks.push(tick)
        }
        return ticks
    }

    async getPrices(seedBlock, toBlock) {
        // get seed price
        const seed = await this.getSeed(seedBlock)
        // get swap events that are emitted after seed block
        const swapEventsMap = await this.getEvents(seed.blockNumber, toBlock, "Swap", this.abi)
        // create an array contains a price for each block mined after seed block 
        const prices = this.createPrices(seed, swapEventsMap, toBlock)

        return prices
    }

    async getFusePrice(fuseBlock, toBlock) { }
}

class PairFactory {
    static pairs = {
        "UniV2": UniV2Pair,
        "UniV3": UniV3Pair,
        "Solidly": SolidlyPair,
    }

    static createPair(chainId, pairAddress, abiStyle) {
        return new this.pairs[abiStyle](chainId, pairAddress)
    }
}

module.exports = {
    CHAINS,
    networksWeb3,
    THRESHOLD,
    FUSE_PRICE_TOLERANCE,
    Q112,
    ETH,
    UNISWAPV2_PAIR_ABI,
    BN,
    toBaseUnit,
    makeBatchRequest,
    PairFactory,

    isPriceToleranceOk: function (price, expectedPrice, priceTolerance) {
        let priceDiff = new BN(price).sub(new BN(expectedPrice)).abs()
        const priceDiffPercentage = new BN(priceDiff).mul(ETH).div(new BN(expectedPrice))
        return {
            isOk: !priceDiffPercentage.gt(new BN(priceTolerance)),
            priceDiffPercentage: priceDiffPercentage.mul(new BN(100)).div(ETH)
        }
    },

    std: function (arr) {
        let mean = arr.reduce((result, el) => result + el, 0) / arr.length
        arr = arr.map((k) => (k - mean) ** 2)
        let sum = arr.reduce((result, el) => result + el, 0)
        let variance = sum / arr.length
        return Math.sqrt(variance)
    },

    removeOutlierZScore: function (prices) {
        const mean = this.calculateAveragePrice(prices)
        // calculate std(standard deviation)
        const std = this.std(prices)
        if (std == 0) return prices

        // Z score = (price - mean) / std
        // price is not reliable if Z score < threshold
        return prices.filter((price) => Math.abs(price - mean) / std < THRESHOLD)
    },

    removeOutlier: function (prices) {
        let reliablePrices = this.removeOutlierZScore(prices)
        reliablePrices = this.removeOutlierZScore(reliablePrices)

        const outlierPrices = []
        prices.forEach((price) => { if (!reliablePrices.includes(price)) outlierPrices.push(price) })
        return { reliablePrices, outlierPrices }
    },

    calculateAveragePrice: function (prices) {
        let add = function (result, el) {
            return result + el
        }
        const sumPrice = prices.reduce(add, 0)
        const averagePrice = parseInt(sumPrice / prices.length)
        return averagePrice
    },

    checkFusePrice: function (price, fusePrice, fusePriceTolerance) {
        const checkResult0 = this.isPriceToleranceOk(price.price0, fusePrice.price0, fusePriceTolerance)
        const checkResult1 = this.isPriceToleranceOk(price.price1, Q112.mul(Q112).div(fusePrice.price0), fusePriceTolerance)

        return {
            isOk0: checkResult0.isOk,
            isOk1: checkResult1.isOk,
            priceDiffPercentage0: checkResult0.priceDiffPercentage,
            priceDiffPercentage1: checkResult1.priceDiffPercentage,
            block: fusePrice.blockNumber
        }
    },

    calculatePairPrice: async function (chainId, abiStyle, pairInfo, toBlock) {
        const seedBlock = toBlock - networksBlocksPerMinute[chainId] * pairInfo.minutesToSeed
        const fuseBlock = toBlock - networksBlocksPerMinute[chainId] * pairInfo.minutesToFuse

        const pair = PairFactory.createPair(chainId, pairInfo.address, abiStyle)
        // get blocks prices
        const rawPrices = await pair.getPrices(seedBlock, toBlock)
        // remove outlier prices
        const { reliablePrices, outlierPrices } = this.removeOutlier(rawPrices)
        // calculate average
        const price = this.calculateAveragePrice(reliablePrices)
        // check fuse price
        const fusePrice = await pair.getFusePrice(fuseBlock, toBlock)
        const fuse = this.checkFusePrice(price, fusePrice, pairInfo.fusePriceTolerance)
        if (!(fuse.isOk0 && fuse.isOk1)) throw { message: `High price gap 0(${fuse.priceDiffPercentage0}%) 1(${fuse.priceDiffPercentage1}%) between fuse and twap price for ${pair.address} in block range ${fuse.block} - ${toBlock}` }

        return {
            price0: price,
            removed: outlierPrices,
        }
    },
}
