**Twaper** is a [Muon](https://github.com/muon-protocol/) app to get a token price from decentralized exchanges in a way that is secure against price manipulations. It uses the [Uniswap TWAP](https://uniswap.org/blog/uniswap-v3-oracles) approach with the following extra benefits over the original on-chain implementation:

- It detects and removes outlier prices before calculating averages to prevent price manipulations through applying a sharp rise/fall in the price for a short duration.
- In order to reject unexpected price changes, it applies a fuse mechanism that stops the system when a short duration average shows a large price volatility compared to a longer one.
- It does not require periodic transactions to register checkpoints on-chain which are costly and hard to maintain.

Twaper gets the price from different sources and returns their weighted average as result. Each source is defined by a route which is a list of pairs. A pair is the address of a liquidity pool on a dex which is the basic source of the price for a token. For example the MUON token price can be calculated using [MUON-WETH, WETH-USDC] route by multiplying the MUON price in WETH by the WETH price in USDC.

## Contents

- [Requirements](#requirements)
- [How to use as a Muon app](#how-to-use-as-a-muon-app)
- [How to use as node module](#how-to-use-as-node-module)
- [Run tests](#run-tests)

## Requirements

- [NodeJs](https://nodejs.org/en/download/package-manager/)

## How to use as a Muon app

### Run a local Muon network

Install [mongo](https://www.mongodb.com/docs/manual/installation/) & [redis](https://redis.io/docs/getting-started/) and use the following steps to clone the Muon node and run a local network:

```bash
$ git clone git@github.com:muon-protocol/muon-node-js.git -b testnet --recurse-submodules
$ cd muon-node-js
$ npm i
$ npm run devnet-init -- -t=3 -n=4 -infura=<your-infura-project-id>
$ npm run devnet-run -- -n=3
$ ./node_modules/.bin/ts-node ./src/cmd config set url "http://localhost:8000/v1"
$ ./node_modules/.bin/ts-node ./src/cmd app deploy "twaper"
```

Then the network is available on [http://localhost:8000/v1/](http://localhost:8000/v1/).

Above steps are required to be done only once and to run the network again you need to use only a single command:

```bash
$ npm run devnet-run -- -n=3
```

### Querying the Muon app

**twaper** Muon app has two methods:

- **price** for getting a normal ERC-20 token TWAP
- **lp_price** for getting a LP token TWAP

To query these methods a **config** should be provided for the corresponding token. **config** is the address of the smart contract contains routes and other required information for the price calculation. twaper is currently using fantom for deployment of the configuration contracts. This [guide](/hardhat/README.md) explains how to deploy a **Config** contract.

Having the configuration deployed, the methods can be queried from the local network in the following way:

`http://localhost:8000/v1/?app=twaper&method=price&params[config]=configAddr`

For example, a config for [INV](https://etherscan.io/token/0x41d5d79431a913c4ae7d69a668ecdfe5ff9dfb68) token is deployed at [`0xb0894bd0c703EF3ee0c1E3054cABfA288762838c`](https://ftmscan.com/address/0xb0894bd0c703EF3ee0c1E3054cABfA288762838c) and can be used to query the price from the ALICE (Muon test network) in this way:

[https://alice.muon.net/v1/?app=twaper&method=price&params[config]=0xb0894bd0c703EF3ee0c1E3054cABfA288762838c](https://alice.muon.net/v1/?app=twaper&method=price&params[config]=0xb0894bd0c703EF3ee0c1E3054cABfA288762838c)

## How to use as node module

**twaper** can also be used as a node module to calculate TWAP of a token.

```js
require("twaper")
const { twaper } = utils
```

`calculatePrice` & `calculateLpPrice` functions can be used to get the price of normal ERC-20 tokens and LP ones.

Full examples that demonstrates how to use these functions are available in [samples](scripts/samples/) folder.

### calculatePrice

`calculatePrice` is used for TWAP calculation of a normal ERC-20 token. It gets 3 inputs and returns the `price` and an object of `removedPrices` which are the prices removed as outliers.

```js
const { price, removedPrices } = await twaper.calculatePrice(validPriceGap, routes, toBlocks)
```

- `validPriceGap` is the valid price difference percentage between differnt routes in scale of `1e18`. If the difference is more than this valid border, the function throws an error.
- `routes` is an array of `route` objects. Each `route` has these following attributes:
  - `path` object is an array of `pair` objects which contains:
    - `address` is the address of the pair contract.
    - `reversed` is `true` if the price of `token1` in terms of `token0` should be used in the price calculation or `false` otherwise.
    - `minutesToSeed` is the time in minutes for which the time weighted average is calculated.
    - `minutesToFuse` is the time in minutes for which the longer duration time weighted average for the fuse mechanism is calculated.
    - `fusePriceTolerance` is the acceptable price difference percentage between the short and long TWAP in scale of `1e18`. The fuse triggers if the difference is more than this border.

  - `chainId` is the id of the chain that the pair contract deployed to.
  - `abiStyle` is the pair contract abi style. For now UniV2 and Solidly are supported.
  - `weight` is the weight of the route in the average calculation.
- `toBlocks` defines the blocks at which the time weighted average price is calculated. There should be a block number for each chain the token has a route on.

### calculateLpPrice

`calculateLpPrice` is used for TWAP calculation of a LP token. It gets 5 inputs and returns the price of the LP token.

```js
const price = await twaper.calculateLpPrice(chainId, pair, routes0, routes1, toBlocks)
```

- `chainId` is the id of the chain that the pair contract of the LP token is deployed to.
- `pair` is the address of the pair contract.
- `routes0` defines the routes for getting the price of `token0` as described in [calculatePirce](#calculateprice).
- `routes1` defines the routes for getting the price of `token1` as described in [calculatePirce](#calculateprice).
- `toBlocks` defines the blocks at which the time weighted average price is calculated. There should be a block number for each chain the pair tokens have a route on.

## Run tests

- Install the required modules and create an `.env` file for running test.

```bash
$ cd twaper
$ npm i
$ cd tests
$ cp .env.sample .env
```

- Edit the `.env` file adn replace `<your-infura-project-key>` by a valid key.
- Run the tests

```bash
$ npm test
```
