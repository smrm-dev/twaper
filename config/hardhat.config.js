const path = require("path");
const envPath = path.join(__dirname, "./.env");
require("dotenv").config({ path: envPath });

require("hardhat-deploy");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("@nomiclabs/hardhat-web3");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    // fantom: {
    //   url: "https://rpc.ankr.com/fantom/" + process.env.ANKR_STRING,
    //   accounts: [
    //     process.env.TESTER2_PRIVATE_KEY,
    //     process.env.DEPLOYER_PRIVATE_KEY,
    //   ],
    //   chainId: 250,
    //   // gas: "auto",
    //   gasPrice: 300100000000,
    //   // gasMultiplier: 1.2
    // },
    localhost: {
      url: "http://127.0.0.1:8547/",
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100000,
          },
        },
      },
    ],
  },
};
