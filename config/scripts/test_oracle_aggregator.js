const hre = require("hardhat");
const { deploy, verifyAll } = require("./helpers/deploy_contract");
const deployOracleAggregator = require("./deploy/deploy_oracle_aggregator");

async function main() {
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  const setter = signers[1];
  const admin = signers[2];

  const muon = "0xE4F8d9A30936a6F8b17a73dC6fEb51a3BBABD51A"
  const appId = 14
  const minimumRequiredSignatures = 3
  const validEpoch = 60 * 5
  const description = "DEI/DEUS"
  const decimals = 18
  const version = 1

  const deus = "0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44"
  const dei = "0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3"
  const wftm = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83"
  const usdc = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75"

  const spiritFactory = "0xEF45d134b73241eDa7703fa787148D9C9F4950b0"
  const spookyFactory = "0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3"
  const sushiFactory = "0xc35DADB65012eC5796536bD9864eD8773aBc74C4"

  const oracleAggregator = await deployOracleAggregator(deploy.address, {
    muon,
    appId,
    minimumRequiredSignatures,
    validEpoch,
    description,
    decimals,
    version,
    setter: setter.address,
    admin: admin.address
  })

  await oracleAggregator.connect(setter).addRoute("Spirit", [deus, dei, usdc], 1, true, spiritFactory);
  await oracleAggregator.connect(setter).addRoute("Spooky", [deus, wftm, usdc], 1, true, spookyFactory);
  await oracleAggregator.connect(setter).addRoute("Sushi", [deus, wftm, usdc], 1, true, sushiFactory);

  const routes1 = await oracleAggregator.getRoutes(false);
  console.log(routes1.map(o => o.weight));

  const routes2 = await oracleAggregator.getRoutes(true);
  console.log(routes2.map(o => o.weight));

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
