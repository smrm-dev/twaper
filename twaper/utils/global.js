const axios = require('axios')
const Web3 = require('web3')

const { toBaseUnit } = require('./crypto')

const {
    getBlock: ethGetBlock,
    getBlockNumber: ethGetBlockNumber,
    getPastEvents: ethGetPastEvents,
    getTokenInfo: ethGetTokenInfo,
    read: ethRead,
    call: ethCall,
} = require('./eth')

const soliditySha3 = require('./soliditySha3');

global.MuonAppUtils = {
    axios,
    Web3,
    BN: Web3.utils.BN,
    ethGetBlock,
    ethGetBlockNumber,
    ethGetPastEvents,
    ethRead,
    ethCall,
    ethGetTokenInfo,
    toBaseUnit,
    soliditySha3,
}

