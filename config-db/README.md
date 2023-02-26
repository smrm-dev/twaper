# ConfigDB

`ConfigDB` is a smart contract used by **twaper** to get the data needed for a token's price calculation. Token can be normal ERC20 or LP. Each kind has its own contract implementation.

## Contents

- [How to deploy](#how-to-deploy)
- [How to add routes](#how-to-add-routes)

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

## How to add routes
