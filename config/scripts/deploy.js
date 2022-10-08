const hre = require("hardhat");
const assert = require('assert/strict');
const { deploy, verifyAll } = require("./helpers/deploy_contract");
const deployOracleFactory = require("./deploy/deploy_oracle_factory");
const deployConfg = require("./deploy/deploy_config");
const sleep = require("./helpers/sleep");

const muon = "0xE4F8d9A30936a6F8b17a73dC6fEb51a3BBABD51A"
const aggregatorMuonAppId = 14
const minimumRequiredSignatures = 3
const validEpoch = 60 * 5
const validPriceGap = BigInt(0.01e18)
const fusePriceTolerance = BigInt(0.3e18)

const deus = "0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44"
const dei = "0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3"
const wftm = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83"
const usdc = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75"

const deusWftmSpirit = "0x2599Eba5fD1e49F294C76D034557948034d6C96E"
const wftmUsdcSpirit = "0xe7E90f5a767406efF87Fdad7EB07ef407922EC1D"
const deusWftmSpooky = "0xaF918eF5b9f33231764A5557881E6D3e5277d456"
const wftmUsdcSpooky = "0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c"

const spiritRoute = [
  "Spirit", // dex
  [deusWftmSpirit, wftmUsdcSpirit], // path
  {
    reversed: [true, true],
    fusePriceTolerance: [fusePriceTolerance, fusePriceTolerance],
    minutesToSeed: [30, 30],
    minutesToFuse: [1440, 1440],
    weight: 1,
    isActive: true,
  } // config
]

const spookyRoute = [
  "Spooky", // dex
  [deusWftmSpooky, wftmUsdcSpooky], // path
  {
    reversed: [true, true],
    fusePriceTolerance: [fusePriceTolerance, fusePriceTolerance],
    minutesToSeed: [30, 30],
    minutesToFuse: [1440, 1440],
    weight: 1,
    isActive: true,
  } // config
]

async function main() {
  const signers = await hre.ethers.getSigners();

  const contractDeployer = signers[0];
  const oracleDeployer = signers[1];
  const setter = signers[2];
  const admin = signers[3];

  const oracleFactory = await deployOracleFactory(contractDeployer.address, {
    muon,
    aggregatorMuonAppId,
    minimumRequiredSignatures,
    validEpoch,
    oracleDeployer: oracleDeployer.address,
    setter: setter.address,
    admin: admin.address
  });
  await sleep(5000);

  // await oracleFactory.connect(oracleDeployer).deployOracle(
  //   dei,
  //   validPriceGap,
  //   "DEI/USDC", // description,
  //   18, // decimals
  //   1, // version
  //   setter.address, // setter
  //   admin.address// admin.address
  // );
  // await sleep(5000);

  // const deiOracleAggregator = await hre.ethers.getContractAt('OracleAggregator', await oracleFactory.deployedOracles(0));
  // await deiOracleAggregator.connect(setter).addRoute("Spirit", [dei, usdc], 1, true, spiritFactory);
  // await sleep(5000);
  // await deiOracleAggregator.connect(setter).addRoute("Spooky", [dei, usdc], 1, true, spookyFactory);
  // await sleep(5000);

  // console.log('Dei routes weights:\n', (await deiOracleAggregator.getRoutes(true)).map(o => [o.dex, o.weight]));

  await oracleFactory.connect(oracleDeployer).deployOracle(
    deus,
    validPriceGap,
    "DEUS/USDC", // description,
    18, // decimals
    1, // version
    setter.address, // setter
    admin.address// admin.address
  );
  await sleep(5000);

  const deusOracleAggregator = await hre.ethers.getContractAt('OracleAggregator', await oracleFactory.deployedOracles(deus));
  await deusOracleAggregator.connect(setter).addRoute(...spiritRoute);
  await sleep(5000);
  await deusOracleAggregator.connect(setter).addRoute(...spookyRoute);
  await sleep(5000);

  // console.log('Deus routes weights:\n', (await deusOracleAggregator.getRoutes(true)).map(o => [o.dex, o.weight]));

  const config = await deployConfg(contractDeployer.address, {
    oracleFactory: oracleFactory.address
  });
  await sleep(5000);

  const routes = await config.getRoutes(deus, true)
  console.log(
    'Deus Routes:\n',
    routes.validPriceGap,
    routes.routes.map((o) =>
      [
        o.dex,
        o.path,
        o.config.reversed,
        o.config.fusePriceTolerance,
        o.config.minutesToSeed,
        o.config.minutesToFuse
      ]
    ))

  await sleep(10000);
  await verifyAll();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
