const hre = require("hardhat");
const assert = require('assert/strict');
const { deploy, verifyAll } = require("./helpers/deploy_contract");
const deployOracleFactory = require("./deploy/deploy_oracle_factory");
const sleep = require("./helpers/sleep");

const muon = "0xE4F8d9A30936a6F8b17a73dC6fEb51a3BBABD51A"
const aggregatorMuonAppId = 14
const minimumRequiredSignatures = 3
const validEpoch = 60 * 5

const deus = "0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44"
const dei = "0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3"
const wftm = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83"
const usdc = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75"

const spiritFactory = "0xEF45d134b73241eDa7703fa787148D9C9F4950b0"
const spookyFactory = "0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3"
const sushiFactory = "0xc35DADB65012eC5796536bD9864eD8773aBc74C4"

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

  await oracleFactory.connect(oracleDeployer).deployOracle(
    "DEI/USDC", // description,
    18, // decimals
    1, // version
    setter.address, // setter
    admin.address// admin.address
  );
  await sleep(5000);

  const deiOracleAggregator = await hre.ethers.getContractAt('OracleAggregator', await oracleFactory.deployedOracles(0));
  await deiOracleAggregator.connect(setter).addRoute("Spirit", [dei, usdc], 1, true, spiritFactory);
  await sleep(5000);
  await deiOracleAggregator.connect(setter).addRoute("Spooky", [dei, usdc], 1, true, spookyFactory);
  await sleep(5000);

  console.log('Dei routes weights:\n', (await deiOracleAggregator.getRoutes(true)).map(o => [o.dex, o.weight]));

  await oracleFactory.connect(oracleDeployer).deployOracle(
    "DEUS/USDC", // description,
    18, // decimals
    1, // version
    setter.address, // setter
    admin.address// admin.address
  );
  await sleep(5000);

  const deusOracleAggregator = await hre.ethers.getContractAt('OracleAggregator', await oracleFactory.deployedOracles(1));
  await deusOracleAggregator.connect(setter).addRoute("Spirit", [deus, dei, usdc], 1, true, spiritFactory);
  await sleep(5000);
  await deusOracleAggregator.connect(setter).addRoute("Spooky", [deus, dei, usdc], 1, true, spookyFactory);
  await sleep(5000);
  await deusOracleAggregator.connect(setter).addRoute("Spirit", [deus, wftm, usdc], 1, true, spiritFactory);
  await sleep(5000);
  await deusOracleAggregator.connect(setter).addRoute("Spooky", [deus, wftm, usdc], 1, true, spookyFactory);

  console.log('Deus routes weights:\n', (await deusOracleAggregator.getRoutes(true)).map(o => [o.dex, o.weight]));

  await sleep(10000);
  await verifyAll();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
