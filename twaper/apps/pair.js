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
    [CHAINS.mainnet]: new Web3("https://rpc.ankr.com/eth"),
    [CHAINS.fantom]: new Web3("https://rpc.ankr.com/fantom"),
    [CHAINS.polygon]: new Web3("https://rpc.ankr.com/polygon"),
    [CHAINS.bsc]: new Web3("https://1rpc.io/bnb"),
    [CHAINS.avax]: new Web3("https://rpc.ankr.com/avalanche"),
}

const networksBlocksPerMinute = {
    [CHAINS.mainnet]: 5,
    [CHAINS.fantom]: 52,
    [CHAINS.polygon]: 29,
    [CHAINS.bsc]: 12,
    [CHAINS.avax]: 55,
}

const THRESHOLD = 2
const FUSE_TICK_TOLERANCE = BigInt(0.3e18)
const Q112 = new BN(2).pow(new BN(112))
const ETH = new BN(toBaseUnit('1', '18'))

const UNISWAPV2_PAIR_ABI = [{ "constant": true, "inputs": [], "name": "getReserves", "outputs": [{ "internalType": "uint112", "name": "_reserve0", "type": "uint112" }, { "internalType": "uint112", "name": "_reserve1", "type": "uint112" }, { "internalType": "uint32", "name": "_blockTimestampLast", "type": "uint32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint112", "name": "reserve0", "type": "uint112" }, { "indexed": false, "internalType": "uint112", "name": "reserve1", "type": "uint112" }], "name": "Sync", "type": "event" }, { "inputs": [], "name": "price0CumulativeLast", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "price1CumulativeLast", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
const UNISWAPV3_PAIR_ABI = [{ "inputs": [], "name": "slot0", "outputs": [{ "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" }, { "internalType": "int24", "name": "tick", "type": "int24" }, { "internalType": "uint16", "name": "observationIndex", "type": "uint16" }, { "internalType": "uint16", "name": "observationCardinality", "type": "uint16" }, { "internalType": "uint16", "name": "observationCardinalityNext", "type": "uint16" }, { "internalType": "uint8", "name": "feeProtocol", "type": "uint8" }, { "internalType": "bool", "name": "unlocked", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" }, { "indexed": false, "internalType": "int256", "name": "amount0", "type": "int256" }, { "indexed": false, "internalType": "int256", "name": "amount1", "type": "int256" }, { "indexed": false, "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" }, { "indexed": false, "internalType": "uint128", "name": "liquidity", "type": "uint128" }, { "indexed": false, "internalType": "int24", "name": "tick", "type": "int24" }], "name": "Swap", "type": "event" }, { "inputs": [{ "internalType": "uint32[]", "name": "secondsAgos", "type": "uint32[]" }], "name": "observe", "outputs": [{ "internalType": "int56[]", "name": "tickCumulatives", "type": "int56[]" }, { "internalType": "uint160[]", "name": "secondsPerLiquidityCumulativeX128s", "type": "uint160[]" }], "stateMutability": "view", "type": "function" }]
const SOLIDLY_PAIR_ABI = [{ "inputs": [], "name": "observationLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "points", "type": "uint256" }, { "internalType": "uint256", "name": "window", "type": "uint256" }], "name": "sample", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "metadata", "outputs": [{ "internalType": "uint256", "name": "dec0", "type": "uint256" }, { "internalType": "uint256", "name": "dec1", "type": "uint256" }, { "internalType": "uint256", "name": "r0", "type": "uint256" }, { "internalType": "uint256", "name": "r1", "type": "uint256" }, { "internalType": "bool", "name": "st", "type": "bool" }, { "internalType": "address", "name": "t0", "type": "address" }, { "internalType": "address", "name": "t1", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "reserve0", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "reserve1", "type": "uint256" }], "name": "Sync", "type": "event" }, { "inputs": [], "name": "getReserves", "outputs": [{ "internalType": "uint256", "name": "_reserve0", "type": "uint256" }, { "internalType": "uint256", "name": "_reserve1", "type": "uint256" }, { "internalType": "uint256", "name": "_blockTimestampLast", "type": "uint256" }], "stateMutability": "view", "type": "function" }]

const makeBatchRequest = async function (w3, requests) {
    let batch = new w3.BatchRequest();

    requests.forEach((request) => batch.add(request.req))
    const responses = await batch.execute()

    let results = new Array(requests.length)
    for (let res of responses) {
        const request = requests[res.id]
        results[res.id] = request.outputsAbi ?
            w3.eth.abi.decodeParameters(request.outputsAbi, res.result) :
            res.result
    }

    return results
}

const calculateLogarithm = function (base, x) {
    var a = Math.log(x);
    var b = Math.log(base);

    return parseInt(a / b);
}

const makeEthGetBlockRequest = function (id, toBlock) {
    return {
        jsonrpc: '2.0',
        id,
        method: 'eth_getBlockByNumber',
        params: ['0x' + toBlock.toString(16), false]
    }

}

class Pair {
    constructor(chainId, address, abi) {
        this.chainId = chainId
        this.address = address
        this.abi = abi
        this.w3 = networksWeb3[this.chainId]
        this.pair = new this.w3.eth.Contract(this.abi, this.address)
    }

    async getEvents(seedBlock, toBlock, event) {
        const options = {
            fromBlock: seedBlock + 1,
            toBlock: toBlock
        }
        const events = await this.pair.getPastEvents(event, options)
        let eventsMap = {}
        // {key: event.blockNumber => value: event}
        events.forEach((event) => eventsMap[event.blockNumber] = event)
        return eventsMap
    }

    async call(method, inputs, block) {
        const result = await this.pair.methods[method](...inputs).call(undefined, block)
        return result
    }

    makeETHCallRequest(id, method, inputs, toBlock) {
        const req = {
            jsonrpc: '2.0',
            id,
            method: 'eth_call',
            params: [
                {
                    to: this.address,
                    data: this.pair.methods[method](...inputs).encodeABI()
                },
                "0x" + toBlock.toString(16),
            ]

        }

        const outputsAbi = this.abi.filter((func) => func.name == method)[0].outputs

        return { req, outputsAbi }
    }
}

class UniV2Pair extends Pair {
    constructor(chainId, address, abi = UNISWAPV2_PAIR_ABI) {
        super(chainId, address, abi)
    }

    calculateInstantPrice(reserve0, reserve1) {
        // multiply reserveA into Q112 for precision in division 
        // reserveA * (2 ** 112) / reserverB
        const price0 = new BN(reserve1).mul(Q112).div(new BN(reserve0))
        return price0
    }

    calculateInstantTick(reserve0, reserve1) {
        // multiply reserveA into Q112 for precision in division 
        const tick0 = calculateLogarithm(1.0001, new BN(reserve1).mul(Q112).div(new BN(reserve0))) - calculateLogarithm(1.0001, Q112)
        // reserveA * (2 ** 112) / reserverB
        return tick0
    }

    async getSeed(seedBlockNumber) {
        const { _reserve0, _reserve1 } = await this.call('getReserves', [], seedBlockNumber)
        const tick0 = this.calculateInstantTick(_reserve0, _reserve1)
        return { tick0, blockNumber: seedBlockNumber }
    }

    createTicks(seed, syncEventsMap, toBlock) {
        let ticks = [seed.tick0]
        let tick = seed.tick0
        // fill ticks and consider a tick for each block between seed and current block
        for (let blockNumber = seed.blockNumber + 1; blockNumber <= toBlock; blockNumber++) {
            // use block event tick if there is an event for the block
            // otherwise use last event tick 
            if (syncEventsMap[blockNumber]) {
                const { reserve0, reserve1 } = syncEventsMap[blockNumber].returnValues
                tick = this.calculateInstantTick(reserve0, reserve1)
            }
            ticks.push(tick)
        }
        return ticks
    }

    async getTicks(seedBlock, toBlock) {
        // get seed tick 
        const seed = await this.getSeed(seedBlock)
        // get sync events that are emitted after seed block
        const syncEventsMap = await this.getEvents(seedBlock, toBlock, "Sync", this.abi)
        // create an array contains a tick for each block mined after seed block 
        const ticks = this.createTicks(seed, syncEventsMap, toBlock)

        return ticks
    }

    updatePriceCumulativeLasts(_price0CumulativeLast, _price1CumulativeLast, toBlockReserves, toBlockTimestamp) {
        const timestampLast = BigInt(toBlockTimestamp) % 2n ** 32n
        if (timestampLast != toBlockReserves._blockTimestampLast) {
            const period = new BN(timestampLast - toBlockReserves._blockTimestampLast)
            const price0CumulativeLast = new BN(_price0CumulativeLast).add(this.calculateInstantPrice(toBlockReserves._reserve0, toBlockReserves._reserve1).mul(period))
            const price1CumulativeLast = new BN(_price1CumulativeLast).add(this.calculateInstantPrice(toBlockReserves._reserve1, toBlockReserves._reserve0).mul(period))
            return { price0CumulativeLast, price1CumulativeLast }
        }
        else return { price0CumulativeLast: _price0CumulativeLast, price1CumulativeLast: _price1CumulativeLast }
    }


    async getFuseTick(fuseBlock, toBlock) {
        const requests = [
            // reqs to get priceCumulativeLast of toBlock
            this.makeETHCallRequest(0, 'price0CumulativeLast', [], toBlock),
            this.makeETHCallRequest(1, 'price1CumulativeLast', [], toBlock),
            this.makeETHCallRequest(2, 'getReserves', [], toBlock),
            { req: makeEthGetBlockRequest(3, toBlock) },
            // reqs to get priceCumulativeLast of seedBlock 
            this.makeETHCallRequest(4, 'price0CumulativeLast', [], fuseBlock),
            this.makeETHCallRequest(5, 'price1CumulativeLast', [], fuseBlock),
            this.makeETHCallRequest(6, 'getReserves', [], fuseBlock),
            { req: makeEthGetBlockRequest(7, fuseBlock) },
        ]

        let [
            _price0CumulativeLast,
            _price1CumulativeLast,
            toReserves,
            to,
            _seedPrice0CumulativeLast,
            _seedPrice1CumulativeLast,
            seedReserves,
            seed,
        ] = await makeBatchRequest(this.w3, requests)

        const { price0CumulativeLast, price1CumulativeLast } = this.updatePriceCumulativeLasts(_price0CumulativeLast['0'], _price1CumulativeLast['0'], toReserves, to.timestamp)
        const { price0CumulativeLast: seedPrice0CumulativeLast, price1CumulativeLast: seedPrice1CumulativeLast } = this.updatePriceCumulativeLasts(_seedPrice0CumulativeLast['0'], _seedPrice1CumulativeLast['0'], seedReserves, seed.timestamp)

        const period = new BN(parseInt(to.timestamp)).sub(new BN(parseInt(seed.timestamp))).abs()

        return {
            tick0: calculateLogarithm(1.0001, new BN(price0CumulativeLast).sub(new BN(seedPrice0CumulativeLast)).div(period)) - calculateLogarithm(1.0001, Q112),
            tick1: calculateLogarithm(1.0001, new BN(price1CumulativeLast).sub(new BN(seedPrice1CumulativeLast)).div(period)) - calculateLogarithm(1.0001, Q112),
            blockNumber: fuseBlock
        }
    }
}

class SolidlyPair extends UniV2Pair {
    constructor(chainId, address, abi = SOLIDLY_PAIR_ABI) {
        super(chainId, address, abi)
    }

    async getFuseTick(fuseBlock, toBlock) {
        const requests0 = [
            this.makeETHCallRequest(0, 'metadata', [], toBlock),
            // reqs to get observationLength of toBlock
            this.makeETHCallRequest(1, 'observationLength', [], toBlock),
            // reqs to get observationLength of seedBlock 
            this.makeETHCallRequest(2, 'observationLength', [], fuseBlock),
        ]

        let [
            metadata,
            observationLength,
            fuseObservationLength,
        ] = await makeBatchRequest(this.w3, requests0)

        const window = observationLength['0'] - fuseObservationLength['0']

        const requests1 = [
            this.makeETHCallRequest(0, 'sample', [metadata.t0, metadata.dec0, 1, window], toBlock),
            this.makeETHCallRequest(1, 'sample', [metadata.t1, metadata.dec1, 1, window], toBlock),
        ]

        let [price0, price1] = await makeBatchRequest(this.w3, requests1)

        return {
            tick0: calculateLogarithm(1.0001, new BN(price0['0'][0]).mul(Q112).div(new BN(metadata.dec0))) - calculateLogarithm(1.0001, Q112),
            tick1: calculateLogarithm(1.0001, new BN(price1['0'][0]).mul(Q112).div(new BN(metadata.dec1))) - calculateLogarithm(1.0001, Q112),
            blockNumber: fuseBlock
        }
    }
}

class UniV3Pair extends Pair {
    constructor(chainId, address, abi = UNISWAPV3_PAIR_ABI) {
        super(chainId, address, abi)
    }

    async getSeed(blockNumber) {
        const { tick } = await this.call('slot0', [], blockNumber)
        return {
            tick: parseInt(tick),
            blockNumber,
        }
    }

    async createTicks(seed, swapEventsMap, toBlock) {
        let ticks = [seed.tick]
        let tick = seed.tick
        // fill ticks and consider a tick for each block between seed and current block
        for (let blockNumber = seed.blockNumber + 1; blockNumber <= toBlock; blockNumber++) {
            // use block event tick if there is an event for the block
            // otherwise use last event tick 
            if (swapEventsMap[blockNumber]) {
                tick = parseInt(swapEventsMap[blockNumber].returnValues.tick)
            }
            ticks.push(tick)
        }
        return ticks
    }

    async getTicks(seedBlock, toBlock) {
        // get seed tick 
        const seed = await this.getSeed(seedBlock)
        // get swap events that are emitted after seed block
        const swapEventsMap = await this.getEvents(seed.blockNumber, toBlock, "Swap", this.abi)
        // create an array contains a tick for each block mined after seed block 
        const ticks = this.createTicks(seed, swapEventsMap, toBlock)

        return ticks
    }

    async getFuseTick(fuseBlock, toBlock) {

        const requests = [
            this.makeETHCallRequest(0, 'observe', [[0]], toBlock),
            { req: makeEthGetBlockRequest(1, toBlock) },
            this.makeETHCallRequest(2, 'observe', [[0]], fuseBlock),
            { req: makeEthGetBlockRequest(3, fuseBlock) },
        ]

        let [
            tickCumulatives1,
            to,
            tickCumulatives0,
            fuse,
        ] = await makeBatchRequest(this.w3, requests)

        const tick0 = parseInt((tickCumulatives1.tickCumulatives[0] - tickCumulatives0.tickCumulatives[0]) / BigInt(to.timestamp - fuse.timestamp))

        return {
            tick0,
            tick1: -tick0,
        }
    }
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
    FUSE_TICK_TOLERANCE,
    Q112,
    ETH,
    UNISWAPV2_PAIR_ABI,
    BN,
    toBaseUnit,
    makeBatchRequest,
    PairFactory,
    calculateLogarithm,

    isPriceToleranceOk: function (price, expectedPrice, priceTolerance) {
        let priceDiff = new BN(price).sub(new BN(expectedPrice)).abs()
        const priceDiffPercentage = new BN(priceDiff).mul(ETH).div(new BN(expectedPrice))
        return {
            isOk: !priceDiffPercentage.gt(new BN(priceTolerance)),
            priceDiffPercentage: priceDiffPercentage.mul(new BN(100)).div(ETH)
        }
    },

    isTicktoleranceOk: function (tick, expectedTick, tickTolerance) {
        let tickDiff = tick - expectedTick
        return {
            isOk: Math.abs(tickDiff) < tickTolerance,
            tickDiff
        }
    },

    std: function (arr) {
        let mean = arr.reduce((result, el) => result + el, 0) / arr.length
        arr = arr.map((k) => (k - mean) ** 2)
        let sum = arr.reduce((result, el) => result + el, 0)
        let variance = sum / arr.length
        return Math.sqrt(variance)
    },

    removeOutlierZScore: function (samples) {
        const mean = this.calculateAverage(samples)
        // calculate std(standard deviation)
        const std = this.std(samples)
        if (std == 0) return samples

        // Z score = (sample - mean) / std
        // sample is not reliable if Z score < threshold
        return samples.filter((sample) => Math.abs(sample - mean) / std < THRESHOLD)
    },

    removeOutlier: function (ticks) {
        let reliableTicks = this.removeOutlierZScore(ticks)
        reliableTicks = this.removeOutlierZScore(reliableTicks)

        const outlierTicks = []
        ticks.forEach((tick) => { if (!reliableTicks.includes(tick)) outlierTicks.push(tick) })
        return { reliableTicks, outlierTicks }
    },

    calculateAverage: function (elements) {
        let add = function (result, el) {
            return result + el
        }
        const sumElements = elements.reduce(add, 0)
        const averageElement = parseInt(sumElements / elements.length)
        return averageElement
    },

    checkFuseTick: function (tick, fuseTick, fuseTickTolerance) {
        const checkResult0 = this.isTicktoleranceOk(tick, fuseTick.tick0, fuseTickTolerance)
        const checkResult1 = this.isTicktoleranceOk(-tick, fuseTick.tick1, fuseTickTolerance)

        return {
            isOk0: checkResult0.isOk,
            isOk1: checkResult1.isOk,
            tickDiff0: checkResult0.tickDiff,
            tickDiff1: checkResult1.tickDiff,
            block: fuseTick.blockNumber
        }
    },

    calculatePairTick: async function (chainId, abiStyle, pairInfo, toBlock) {
        const seedBlock = toBlock - networksBlocksPerMinute[chainId] * pairInfo.minutesToSeed
        const fuseBlock = toBlock - networksBlocksPerMinute[chainId] * pairInfo.minutesToFuse

        const pair = PairFactory.createPair(chainId, pairInfo.address, abiStyle)
        // get blocks ticks 
        const rawTicks = await pair.getTicks(seedBlock, toBlock)
        // remove outlier ticks 
        const { reliableTicks, outlierTicks } = this.removeOutlier(rawTicks)
        // calculate average
        const tick = this.calculateAverage(reliableTicks)
        // check fuse tick 
        const fuseTick = await pair.getFuseTick(fuseBlock, toBlock)
        const fuse = this.checkFuseTick(tick, fuseTick, pairInfo.fuseTickTolerance)
        if (!(fuse.isOk0 && fuse.isOk1)) throw { message: `High tick gap 0(${fuse.tickDiff0}) 1(${fuse.tickDiff1}) between fuse and twap tick for ${pair.address} in block range ${fuse.block} - ${toBlock}` }

        return {
            tick0: tick,
            removed: outlierTicks,
        }
    },
}
