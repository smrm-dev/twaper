const axios = require('axios')
const { Web3 } = require('web3')
const { BN } = require('bn.js')

const { toBaseUnit } = require('./crypto')

const {
    getBlock: ethGetBlock,
    getBlockNumber: ethGetBlockNumber,
    getPastEvents: ethGetPastEvents,
    read: ethRead,
    call: ethCall,
} = require('./eth')

const soliditySha3 = require('./soliditySha3');

global.MuonAppUtils = {
    axios,
    Web3,
    BN,
    ethGetBlock,
    ethGetBlockNumber,
    ethGetPastEvents,
    ethRead,
    ethCall,
    toBaseUnit,
    soliditySha3,
}

