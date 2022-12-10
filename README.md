**twaper** is a muon app which calculates a ERC-20 token's time weighted average price using a provided config. Config is a smart contract which contains some routes for a specific token on different chains. Whether the token is a noraml ERC-20 or LP the app has the ability to calculate TWAP of that token. For normal ones it returns the average of TWAPs on differnt routes and for LP ones it uses a formula based on TWAPs of the tokens exist in the liquidity pool. Here in the repo there is [contracts](hardhat/contracts/) folder which contains the implementation for `Config` and [twaper](twaper/apps/) folder which contains the muon app implementation.

## Contents

- [Requirements](#requirements)
- [Run muon app locally](#run-as-muon-app-locally)
- [How to use local muon network](#how-to-use-local-muon-network)
- [How to use as node module](#how-to-use-as-node-module)
- [Run tests](#run-tests)
- [Write tests](#write-tests)
- [Deployments](#deployments)

## Requirements

- [NodeJs](https://nodejs.org/en/download/package-manager/)

## Run as muon app locally

Runnig a local muon network for the first time will takes these steps:

- Install [mongo](https://www.mongodb.com/docs/manual/installation/) & [redis](https://redis.io/docs/getting-started/)
- `git clone git@github.com:muon-protocol/muon-node-js.git -b testnet --recurse-submodules`
- `cd muon-node-js`
- `npm i`
- `npm run devnet-init -- -t=3 -n=4 -infura=<your-infura-project-id>`
- `npm run devnet-run -- -n=3`
- `./node_modules/.bin/ts-node ./src/cmd config set url "http://localhost:8000/v1"`
- `./node_modules/.bin/ts-node ./src/cmd app deploy "twaper"`

Then muon network is available on [http://localhost:8000/v1/](http://localhost:8000/v1/).

For the next runs running the network will be much easier:

- `npm run devnet-run -- -n=3`

## How to use local muon network

**twaper** muon app has two methods:

- **price** for getting a normal ERC-20 token TWAP
- **lp_price** for getting a LP token TWAP

For each of the methods a **config** is needed for the corresponding token. **config** is the address of the smart contract contains routes considered as price source in TWAP calculation. So for each token at least one contract is needed.

This is the [guide](/hardhat/README.md) on how to deploy a **Config** contract.

After that, **twaper** can return a price for each deployed config through these links with valid config addresses:

- [http://localhost:8000/v1/?app=twaper&method=price&params[config]=configAddr](http://localhost:8000/v1/?app=twaper&method=price&params[config]=configAddr)
- [http://localhost:8000/v1/?app=twaper&method=lp_price&params[config]=configAddr](http://localhost:8000/v1/?app=twaper&method=lp_price&params[config]=configAddr)

## How to use as node module

**twaper** simply can be used as a external library to calculate TWAP of a token (normal ERC-20 and LP).

```
require("twaper")
const { twaper } = utils
```

`calculatePrice` & `calculateLpPrice` are the functions currently can be used for TWAP calculation for normal ERC-20 tokens and LP ones.

The full example for usage of these functions are in [samples](scripts/samples/).

### calculatePrice

`calculatePrice` is used for TWAP calculation of a normal ERC-20 token. It gets 3 inputs and then returns a `price` and an object of `removedPrices` which are the prices removed as outliers.

```
const { price, removedPrices } = await twaper.calculatePrice(validPriceGap, routes, toBlocks)
```

The inputs are like this:

- `validPriceGap` is the valid price difference percentage between routes used for TWAP calculation in scale of `1e18`.
- `routes` is an array of `route` object. Each `route` has these following attributes:
  - `path` object is an array of `pair` object which contains:
    - `address` of the pair
    - `reversed` boolean attribute which shows whether `token0` price (`false`) should be used for price calculation or `token1` (`true`)
    - `minutesToSeed` is the time in minutes for which price calculation will be done.
    - `minutesToFuse` is the time in minutes fuse check will be done.
    - `fusePriceTolerance` is the acceptable price difference percentage between seed TWAP and fuse TWAP in scale of `1e18`.
  - `chainId`
  - `abiStyle` is the pair contract abi style. For now UniV2 and Solidly are supported.
  - `weight` is the coefficient of the route's price at TWAP calculation.
- `toBlocks` is the blocks numbers until them price is calculated. There should be a block number for each chain the token has a route on.

```
const deusSpiritRoute = {
    dex: "Spirit", // dex
    path: [
        {
            address: deusWftmSpirit,
            reversed: true,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
            fusePriceTolerance: fusePriceTolerance,
        },
        {
            address: wftmUsdcSpirit,
            reversed: true,
            minutesToSeed: halfHourMinutes,
            minutesToFuse: dayMinutes,
            fusePriceTolerance: fusePriceTolerance,
        },
    ], // path
    chainId: 250,
    abiStyle: "UniV2",
    weight: 1,
}
```

### calculateLpPrice

As mentioned earlier in this document **twaper** can also calculate TWAP for LP tokens. `calculateLpPrice` is the function used for this purpose. It has 5 input parameters and 1 return value which is the TWAP of specified LP token.

```
const price = await twaper.calculateLpPrice(chainId, pair, routes0, routes1, toBlocks)
```

- `chainId` is the first input
- `pair` which is the address of the pair is the second one
- Third one is `routes0` and that's the routes (which is discussed in [calculatePirce](#calculateprice)) should be used for TWAP calculation of `token0`
- `routes1`, forth one, is similar to `routes0` but for `token1`

```
const routesX = {
    validPriceGap: validPriceGap,
    routes: [route0, route1, ...]
}
```

- And the last one is `toBlocks` which is the block numbers until them price should be calculated.

## Run tests

For testing the functionallity of the app and each function in it follow these steps:

- `cd twaper`
- `npm i`
- `cd tests`
- `cp .env.sample .env`
- Replace `<your-infura-project-key>` with a valid one.
- `npm test <TEST_FILE_NAME>.test.js`

## Write tests

You can also write your own test files and do the 4th step in the [Run tests](#run-tests) section again for each of them.

To do so just create a new file with `.test.js` postfix and then start writing your testcase by following the structure of default testcases in the [tests](twaper/tests/) folder.

The following lines helps you to import the `app` and use its functions:

```
require('dotenv').config({ path: './.env' })
require('../utils/global')
const assert = require('assert')
const { dynamicExtend } = require('../utils/utils')
const TokenPriceFeedApp = dynamicExtend(
    class { },
    require('../apps/token_price_feed')
)
const app = new TokenPriceFeedApp()
```

Use `describe` method for bunch of testcases and use `it` method for each of them.

```
describe('Test Cases', () => {
    it('#1', async () => {
        ...
    })

    it('#2', async () => {
        ...
    }) 
})
```

In the corresponding block of each `it` method you can use `app` object to call
a specific function:

```
it('#1', async () => {
    app.functionName(args)
})
```

## Deployments

There is no availble deployments for this app
