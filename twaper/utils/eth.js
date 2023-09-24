const { Web3 } = require('web3')
const { EthRpcList } = require('./eth-rpc-list.js');
const HttpProvider = Web3.providers.HttpProvider

const _generalWeb3Instance = new Web3()
const soliditySha3 = _generalWeb3Instance.utils.soliditySha3

const web3Instances = {
}

const lastUsedRpcIndex = {
};

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

function getNetworkId(network) {
  if (!!EthRpcList[network])
    return network
  return nameToChainIdMap[network]
}

function getWeb3(network) {
  let chainId = getNetworkId(network);
  if (chainId === undefined)
    return Promise.reject({ message: `invalid network "${network}"` })

  if (!web3Instances[chainId]) {
    const nextRpc = ((lastUsedRpcIndex[chainId] ?? -1) + 1) % EthRpcList[chainId].length;
    lastUsedRpcIndex[chainId] = nextRpc;
    web3Instances[chainId] = new Web3(new HttpProvider(EthRpcList[chainId][nextRpc]))
  }

  return Promise.resolve(web3Instances[chainId])
}

async function wrappedCall(network, web3ApiCall, args = []) {
  try {
    return await web3ApiCall(...args)
  }
  catch (e) {
    if (errorNeedRpcRotate(e.message)) {
      const chainId = getNetworkId(network);
      console.log(`error on web3 call`, { chainId }, e.message)
      delete web3Instances[chainId];
    }
    throw e
  }
}

function call(contractAddress, methodName, params, abi, network) {
  return getWeb3(network).then((web3) => {
    let contract = new web3.eth.Contract(abi, contractAddress)
    return wrappedCall(network, contract.methods[methodName](...params).call)
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
    return wrappedCall(network, web3.eth.getBlock.bind(web3), [blockHashOrBlockNumber])
  })
}

function getBlockNumber(network) {
  return getWeb3(network).then((web3) => {
    return wrappedCall(network, web3.eth.getBlockNumber.bind(web3))
  })
}

function getPastEvents(network, contractAddress, abi, event, options) {
  return getWeb3(network).then((web3) => {
    let contract = new web3.eth.Contract(abi, contractAddress)
    return wrappedCall(network, contract.getPastEvents.bind(contract), [event, options])
  })
}

module.exports = {
  getWeb3,
  getNetworkId,
  getBlock,
  getBlockNumber,
  getPastEvents,
  soliditySha3,
  call,
}
