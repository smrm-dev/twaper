const hre = require("hardhat");
const { verifyAll } = require("./helpers/deploy_contract");
const deployConfigFactory = require("./deploy/deploy_config_factory");
const sleep = require("./helpers/sleep");

const validPriceGap = BigInt(0.01e18)
const fusePriceTolerance = BigInt(0.3e18)

const deusWftmSpirit = "0x2599Eba5fD1e49F294C76D034557948034d6C96E"
const wftmUsdcSpirit = "0xe7E90f5a767406efF87Fdad7EB07ef407922EC1D"
const deusWftmSpooky = "0xaF918eF5b9f33231764A5557881E6D3e5277d456"
const wftmUsdcSpooky = "0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c"
const invWeth = "0x328dfd0139e26cb0fef7b0742b49b0fe4325f821"
const WethUsdc = "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0"

const halfHourMinutes = 30
const dayMinutes = 1440

CHAINS = {
  fantom: 250,
  mainnet: 1
}

const deusSpiritRoute = [
  "Spirit", // dex
  [deusWftmSpirit, wftmUsdcSpirit], // path
  {
    chainId: CHAINS.fantom,
    reversed: [true, true],
    fusePriceTolerance: [fusePriceTolerance, fusePriceTolerance],
    minutesToSeed: [halfHourMinutes, halfHourMinutes],
    minutesToFuse: [dayMinutes, dayMinutes],
    weight: 1,
    isActive: true,
  } // config
]

const deusSpookyRoute = [
  "Spooky", // dex
  [deusWftmSpooky, wftmUsdcSpooky], // path
  {
    chainId: CHAINS.fantom,
    reversed: [true, true],
    fusePriceTolerance: [fusePriceTolerance, fusePriceTolerance],
    minutesToSeed: [halfHourMinutes, halfHourMinutes],
    minutesToFuse: [dayMinutes, dayMinutes],
    weight: 1,
    isActive: true,
  } // config
]

const invSushiRoute = [
  "Sushi", // dex
  [invWeth, WethUsdc], // path
  {
    chainId: CHAINS.mainnet,
    reversed: [false, true],
    fusePriceTolerance: [fusePriceTolerance, fusePriceTolerance],
    minutesToSeed: [halfHourMinutes, halfHourMinutes],
    minutesToFuse: [dayMinutes, dayMinutes],
    weight: 1,
    isActive: true,
  } // config
]

async function main() {
  const signers = await hre.ethers.getSigners();

  const contractDeployer = signers[0];
  const configDeployer = signers[1];
  const setter = signers[2];
  const admin = signers[3];

  const configFactory = await deployConfigFactory(contractDeployer.address);
  await sleep(5000);

  await configFactory.connect(configDeployer).deployConfig(
    "DEUS/USDC", // description,
    validPriceGap,
    setter.address, // setter
    admin.address// admin.address
  );
  await sleep(5000);

  await configFactory.connect(configDeployer).deployConfig(
    "INV/USDC", // description,
    validPriceGap,
    setter.address, // setter
    admin.address// admin.address
  );
  await sleep(5000);

  const deusConfig = await hre.ethers.getContractAt('Config', await configFactory.deployedConfigs(0));
  await deusConfig.connect(setter).addRoute(...deusSpiritRoute);
  await sleep(5000);
  await deusConfig.connect(setter).addRoute(...deusSpookyRoute);
  await sleep(5000);

  const invConfig = await hre.ethers.getContractAt('Config', await configFactory.deployedConfigs(1));
  await invConfig.connect(setter).addRoute(...invSushiRoute);
  await sleep(5000);

  const deusRoutes = await deusConfig.getRoutes()
  console.log(
    'Deus Routes:\n',
    deusRoutes.validPriceGap_,
    deusRoutes.routes_.map((o) => {
      return {
        dex: o.dex,
        path: o.path,
        chainId: o.config.chainId,
        reversed: o.config.reversed,
        fpt: o.config.fusePriceTolerance,
        mts: o.config.minutesToSeed,
        mtf: o.config.minutesToFuse
      }
    }
    ))

  const invRoutes = await invConfig.getRoutes()
  console.log(
    'Inv Routes:\n',
    invRoutes.validPriceGap_,
    invRoutes.routes_.map((o) => {
      return {
        dex: o.dex,
        path: o.path,
        chainId: o.config.chainId,
        reversed: o.config.reversed,
        fpt: o.config.fusePriceTolerance,
        mts: o.config.minutesToSeed,
        mtf: o.config.minutesToFuse
      }
    }
    ))

  await sleep(10000);
  await verifyAll();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
