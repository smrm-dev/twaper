const hre = require("hardhat");
const { deployConfig, deployConfigFactory } = require('../deploy')
const { validPriceGap } = require('./constants')
const { invRoutes, dopRoutes, sellcRoutes } = require('./token_routes')


async function main() {
    const signers = await hre.ethers.getSigners();

    const contractDeployer = signers[0];
    const setter = signers[0];
    const admin = signers[0];

    const configFactory = await deployConfigFactory(contractDeployer.address);

    const roles = { contractDeployer, setter, admin }

    // INV
    await deployConfig(roles, configFactory.address, { description: "INV", validPriceGap, routes: invRoutes })

    // DOP
    await deployConfig(roles, configFactory.address, { description: "DOP", validPriceGap, routes: dopRoutes })

    // SELLC
    await deployConfig(roles, configFactory.address, { description: "SELLC", validPriceGap, routes: sellcRoutes })
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});