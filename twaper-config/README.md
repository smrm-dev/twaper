# Config

`Config` is a smart contract used by **twaper** to load required configurations for calculating price of a token. `Config` has two different implementations, one for getting required configurations for calculating price of a normal ERC20 token and another for a LP token.

## Contents

- [Deploy](#deploy)
- [Add a `Route`](#add-a-route)
- [Update a `Route`](#update-a-route)
- [Get `Route`s](#get-routes)

## Deploy

### ConfigFactory

`ConfigFactory` is a factory contract that is implemented to simplify deployment of `Config` contracts. It has two methods:

- `deployConfig` to deploy a config for a normal ERC20 token price calculation
- `deployLpConfig` to deploy a config for a LP token price calculation

No input is required to deploy the `ConfigFactory` itself, and any of the [methods for deploying a contract](https://ethereum.org/en/developers/docs/smart-contracts/deploying/#:~:text=To%20deploy%20a%20smart%20contract,contract%20without%20specifying%20any%20recipient.) can be used to do that.

It's not generally required to deploy the `ConfigFactory` yourself. It's deployed [?here](https://ftmscan.com/) and you can call its methods to deploy different `Config` instances for calculating price of different tokens.

### deployConfig

Deploying required `Config` for calculating price of a normal ERC20 token is as easy as calling `deployConfig` function on the [?`ConfigFactory`](https://ftmscan.com/). This method has the following inputs:

- `description` is a string to describe `Config` which is going to be deployed (e.g. `"ETH/USDC"` means `Config` contains routes can be used to calculate price of ETH in terms of USDC).
- `validPriceGap`  is the valid price difference percentage between differnt routes in scale of `1e18`.
- `setter` is the address that is authorized to update the `Config`.
- `admin` is the address of `Config`'s admin.

### deployLpConfig

Just like `Config`, deployment of a `LpConfig` is as simple as calling `deployLpConfig` function. This method has the following inputs:

- `chainId` is the chain id in which Lp token is deployed
- `pair` is the address of the Lp token
- `config0` is the address of the `Config` deployed for `token0`
- `config1` is the address of the `Config` deployed for `token1`
- `description` is a string to describe `LpConfig` which is going to be deployed (e.g. `"ETH-USDC LP Uniswap"` means `LpConfig` can be used to calculate price for ETH-USDC LP on Uniswap).
- `setter` is the address that is authorized to update the `Config`.
- `admin` is the address of `Config`'s admin.

## Add a `Route`

The most important configuration that a `Config` instance hosts is the list of routes that can be used to calculate the price of a normal ERC20 token. 
**twaper** calculates price of the token for each route separately and then returns a weighted average as the final price.

`addRoute` function can be used to add a new route to a `Config` instance. This method has the following inputs:

- `dex` is the name of the dex that the `Route` belongs to.
- `path` is an array that includes the addresses of the pairs of the `Route` where each pair refers to a dex pool contract. E.x `[0xaF918eF5b9f33231764A5557881E6D3e5277d456, 0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c]` is the list of deusWftm and wftmUsdc pair addresses on [SpookySwap](https://spooky.fi/#/) that can be used as a route to find the price of the [DEUS](https://deus.finance/) token.
- `config` defines the configurations that should be considered during price calculation in **twaper**. It is a `struct` with 8 attributes:
  - `chainId` is the chain id which the `Route` exists on.
  - `abiStyle` is the style of ABI of the dex of the `Route`. `UniV2`, `Solidly`, etc are valid values.
  - `reversed` is an array of booleans which specifies if the price of `token0` in terms of `token1` for each pair should be used in the price calculation of the route or the price of `token1` in terms of `token0`. E.x `[true, true]` is the right value for DEUS token route on SpookySwap. That means in **twaper**, price of `token1‍` in terms of `token0` for both pairs on the `path` should be used which are DEUS and WFTM.
  - `fusePriceTolerance` is an array of `uint256` values which each value specifies the acceptable difference percentage between twap and fuse price of the corresponding pair in scale of `1e18`. E.x `[3e17, 3e17]` means a gap of 30% between twap and fuse price of both pairs is acceptable. price of a pair means price of a token in the pair in terms of the other.
  - `minutesToSeed` is durations in minutes for which the time weighted average price is calculated for each pair.
  - `minutesToFuse` is durations in minutes for which the fuse price is calculated for each pair.
  - `weight` is the weight of the `Route` compared to other routes. It is used to calculate weighted average of the prices of the different routes.
  - `isActive` is a boolean for showing `Route` status. `Routes` with `False` value don't participate in the average calculation.

**Routes can be added by users that the `SETTER_ROLE` of the contract is granted to them.**

## Update a `Route`

There are two ways for updating a `Route`:

### `updateRoute`

This function gets the same inputs as `addRoute` plus an `index` and replaces the new route with the route in the corrosponding `index` of the config.

### Updating attributes of a `Route`

The following functions can be used to update different attributes of a route:

- `setFusePriceTolerance`
- `setMinutesToSeed`
- `setMinutesToFuse`
- `setWeight`
- `setIsActive`

All of the above functions get `index` of the `Route` and new value for the attribute needed to be updated.

**Routes can be updated by users that the `SETTER_ROLE` of the contract is granted to them.**

## Get `Route`s

All `Route`s of a `Config` can be obtained by calling the `getRoutes` function. This function returns `validPriceGap` and array of `Route`s.
