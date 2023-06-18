const hre = require("hardhat");
const { deployConfig, deployConfigFactory, deployLpConfig } = require('../deploy')
const { validPriceGap, zeroAddress, CHAINS } = require('./constants')
const { invRoutes, dopRoutes, sellcRoutes, legacyDeiRoutes, legacyDeiUsdcSolidly } = require('./token_routes')


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

    // LEAGACY-DEI
    const legacyDeiConfig = await deployConfig(roles, configFactory.address, { description: "LEGACY-DEI", validPriceGap, routes: legacyDeiRoutes })

    // LEGACY-DEI Solidly LP
    await deployLpConfig(
        roles,
        configFactory.address,
        {
            chainId: CHAINS.fantom,
            pairAddress: legacyDeiUsdcSolidly,
            config0: zeroAddress,
            config1: legacyDeiConfig.address,
            description: 'LEGACY_DEI-USDC LP Solidly'
        }
    )
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});