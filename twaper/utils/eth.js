const Web3 = require('web3')
const HttpProvider = Web3.providers.HttpProvider

const _generalWeb3Instance = new Web3()
const soliditySha3 = _generalWeb3Instance.utils.soliditySha3

const _networksWeb3 = {
  ganache: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_GANACHE)),
  // ethereum mani net
  1: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_ETH)),
  3: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_ROPSTEN)),
  4: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_RINKEBY)),
  56: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_BSC)),
  97: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_BSCTEST)),
  250: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_FTM)),
  4002: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_FTMTEST)),
  100: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_XDAI_MAINNET || 'https://rpc.xdaichain.com/')),
  77: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_XDAI_SOKOL_TESTNET || 'https://sokol.poa.network')),
  137: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_POLYGON)),
  80001: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_MUMBAI)),
  43113: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_AVALANCHE_FUJI_TESTNET || 'https://api.avax-test.network/ext/bc/C/rpc')),
  43114: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_AVALANCHE_MAINNET || 'https://api.avax.network/ext/bc/C/rpc')),
  421611: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_ARBITRUM_TESTNET || 'https://rinkeby.arbitrum.io/rpc')),
  42161: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_ARBITRUM_MAINNET || 'https://arb1.arbitrum.io/rpc')),
  1088: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_METIS || 'https://andromeda.metis.io/?owner=1088')),
  10: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_OPTIMISM || 'https://rpc.ankr.com/optimism')),
  420: new Web3(new HttpProvider(process.env.WEB3_PROVIDER_OPTIMISM_TESTNET || 'https://rpc.ankr.com/optimism_testnet')),
}

const nameToChainIdMap = {
  local: 'ganache',
  eth: 1, // Ethereum mainnet
  ropsten: 3, // Ethereum ropsten testnet
  rinkeby: 4, // Ethereum rinkeby testnet
  bsc: 56, // Binance Smart Chain mainnet
  bsctest: 97, // Binance Smart Chain testnet
  ftm: 250, // Fantom mainnet
  ftmtest: 4002, // Fantom testnet
  xdai: 100, // Xdai mainnet
  sokol: 77, // Xdai testnet
  polygon: 137, // polygon mainnet
  mumbai: 80001, // Polygon mumbai testnet
  fuji: 43113, // Avalanche Fuji Testnet
  avax: 43114, // Avalanche Mainnet
  arbitrumTestnet: 421611, //Arbitrum Testnet
  arbitrum: 42161, // Arbitrum
  metis: 1088, // Metis
  optimism: 10, // Optimism
  optimismTestnet: 420, // Optimism Testnet
}

function getWeb3(network) {
  if (_networksWeb3[network]) return Promise.resolve(_networksWeb3[network])
  else if (_networksWeb3[nameToChainIdMap[network]])
    return Promise.resolve(_networksWeb3[nameToChainIdMap[network]])
  else return Promise.reject({ message: `invalid network "${network}"` })
}


function call(contractAddress, methodName, params, abi, network) {
  return getWeb3(network).then((web3) => {
    let contract = new web3.eth.Contract(abi, contractAddress)
    return contract.methods[methodName](...params).call()
  })
}

function read(contractAddress, property, params, abi, network) {
  return getWeb3(network).then((web3) => {
    let contract = new web3.eth.Contract(abi, contractAddress)
    return contract.methods[property].call(...params)
  })
}

function getBlock(network, blockHashOrBlockNumber) {
  return getWeb3(network).then((web3) => {
    return web3.eth.getBlock(blockHashOrBlockNumber)
  })
}

function getBlockNumber(network) {
  return getWeb3(network).then((web3) => {
    return web3.eth.getBlockNumber()
  })
}

function getPastEvents(network, contractAddress, abi, event, options) {
  return getWeb3(network).then((web3) => {
    let contract = new web3.eth.Contract(abi, contractAddress)
    return contract.getPastEvents(event, options)
  })
}

module.exports = {
  getWeb3,
  getBlock,
  getBlockNumber,
  getPastEvents,
  soliditySha3,
  call,
  read,
}
