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
const fusePriceTolerance = BigInt(0.1e18)

const deus = "0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44"
const dei = "0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3"
const inv = "0x41D5D79431A913C4aE7d69a668ecdfE5fF9DFB68"

const invWeth = "0x328dfd0139e26cb0fef7b0742b49b0fe4325f821"
const WethUsdc = "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0"

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
        inv,
        validPriceGap,
        "INV/USDC", // description,
        18, // decimals
        1, // version
        setter.address, // setter
        admin.address// admin.address
    );
    await sleep(5000);

    const invOracleAggregator = await hre.ethers.getContractAt('OracleAggregator', await oracleFactory.deployedOracles(inv));
    await invOracleAggregator.connect(setter).addRoute("Sushi", [invWeth, WethUsdc], [false, true], [fusePriceTolerance, fusePriceTolerance], 1, true);
    await sleep(5000);

    // console.log('Inv routes weights:\n', (await invOracleAggregator.getRoutes(true)).map(o => [o.dex, o.weight]));

    const config = await deployConfg(contractDeployer.address, {
        oracleFactory: oracleFactory.address
    });
    await sleep(5000);

    const routes = await config.getRoutes(inv, true)
    console.log('Inv Routes:\n', routes.validPriceGap, routes.routes.map((o) => [o.dex, o.path, o.reversed, o.fusePriceTolerance]))

    await sleep(10000);
    await verifyAll();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
