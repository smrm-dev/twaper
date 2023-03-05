# ConfigDB

`ConfigDB` is a smart contract used by **twaper** to get the data needed for a token's price calculation. Token can be normal ERC20 or LP. Each kind has its own contract implementation.

## Contents

- [How to deploy](#how-to-deploy)
- [How to add route](#how-to-add-route)

## How to deploy

### ConfigFactory

To deploy a `ConfigDB` for a token regardless of its kind (normal/LP), `ConfigFactory` contract is required. It has two separate functions to deploy `ConfigDB` for each of the normal and LP ERC20 tokens:

- `deployConfig` for normal
- `deployLpConfig` for LP

No inputs are needed for deploying `ConfigFactory` and it can be done by any of the [methods of deploying a contract](https://ethereum.org/en/developers/docs/smart-contracts/deploying/#:~:text=To%20deploy%20a%20smart%20contract,contract%20without%20specifying%20any%20recipient.).

Having the `ConfigFactory` deployed, `ConfigDB` can be deployed by calling either of the functions mentioned.

### deployConfig

Deploying a `ConfigDB` for a normal ERC20 token is as easy as calling a function named `deployConfig`.

It has 4 inputs should be provided by the deployer:

- `description` is a string to describe `ConfigDB` which is going to be deployed (e.g. `"ETH/USDC"` means `ConfigDB` contains routes can be used to calculate price of ETH in terms of USDC.)
- `validPriceGap` is the valid price gap between routes of the token which `ConfigDB` contains its routes. It is used by **twaper**.
- `setter` is the address which can change data of `ConfigDB`
- `admin` is the address of `ConfigDB`'s admin.

Calling `deployConfig` can be done by running a script or through a block explorer UI.

### deployLpConfig

Just like `ConfigDB` one function call can do the job of deploying a `LpConfigDB`.

Inputs are 7 and here are the details for them:

- `chainId` is the chain id in which Lp token deployed
- `pair` is the address of the Lp token
- `config0` is the address of the `ConfigDB` deployed for `token0`
- `config1` is the address of the `ConfigDB` deployed for `token1`
- `description` is a string to describe `LpConfigDB` which is going to be deployed (e.g. `"ETH-USDC LP Uniswap"` means `LpConfigDB` can be used for ETH-USDC LP of Uniswap price calculation)
- `setter` is the address which can change data of `ConfigDB`
- `admin` is the address of `ConfigDB`'s admin.

## How to add route

Routes are the data which used by **twaper** to calculate a normal ERC20 token's twap. Each `ConfigDB` contract store a token's Route.

For adding a `Route` to the contract `addRoute` function is used. It has 3 inputs and below is the description:

- `dex` is the name of the dex, the `Route` belongs to.
- `path` is an address array which contains pair addresses of the `Route`. E.x `[0xaF918eF5b9f33231764A5557881E6D3e5277d456, 0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c]` is [SpookySwap](https://spooky.fi/#/) route for [DEUS](https://deus.finance/) token. First is deusWftm address and second is wftmUsdc address.
- `config` is the `Config` should be considered during price calculation in **twaper**. `Config`'s type is `struct` and it has 8 members:

  - `chainId` is the chain id which the `Route` exists on.
  - `abiStyle` is the style of ABI of the dex of the `Route`. `UniV2`, `Solidly`, etc are valid values.
  - `reversed` is an array of booleans which are the indicator of the token that its price should be used in price calculation. E.x `[true, true]` is the right value for DEUS token route on SpookySwap.That means in **twaper**, price of token1 for both pairs on the `path` should be used which are DEUS and WFTM.
  - `fusePriceTolerance` is an array of `uint256`. Each element is the acceptable difference percentage between twap and fuse price of the corresponding pair. E.x `[3e17, 3e17]` means a gap of 30% between twap and fuse price of both pairs is acceptable. price of a pair means price of tokens in the pair in terms of the other token.
  - `minutesToSeed` is durations (in minutes) for which pairs twaps calculated.
  - `minutesToFuse` is durations (in minutes) for which pairs fuse prices calculated.
  - `weight` is weight of `Route` in twap calculation.
  - `isActive` is a boolean for showing `Route` status. `Routes` with `False` value don't participate in twap calculation.
