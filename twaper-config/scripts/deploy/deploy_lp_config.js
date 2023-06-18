const hre = require("hardhat");
const sleep = require("../helpers/sleep")

module.exports = async function deployLpConfig({ contractDeployer, setter, admin }, configFactoryAddress, { chainId, pairAddress, config0, config1, description }) {
    const configFactory = await hre.ethers.getContractAt("ConfigFactory", configFactoryAddress)
    const configsCount = await configFactory.deployedLpConfigsCount();
    await configFactory.connect(contractDeployer).deployLpConfig(
        chainId, pairAddress, config0, config1, description, setter.address, admin.address
    );
    await sleep(5000);

    const config = await hre.ethers.getContractAt('LpConfig', (await configFactory.deployedLpConfigs(configsCount)).addr);
    console.log(`${description} LpConfig deployed to:`, config.address)
}