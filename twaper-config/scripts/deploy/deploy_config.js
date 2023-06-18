const hre = require("hardhat");
const sleep = require("../helpers/sleep")

module.exports = async function deployConfig({ contractDeployer, setter, admin }, configFactoryAddress, { description, validPriceGap, routes }) {
    const configFactory = await hre.ethers.getContractAt("ConfigFactory", configFactoryAddress)
    const configsCount = await configFactory.deployedConfigsCount();
    await configFactory.connect(contractDeployer).deployConfig(
        description, // description,
        validPriceGap,
        setter.address, // setter
        admin.address// admin.address
    );
    await sleep(5000);

    const config = await hre.ethers.getContractAt('Config', (await configFactory.deployedConfigs(configsCount)).addr);
    console.log(`${description} Config deployed to:`, config.address)
    await config.connect(setter).addRoutes(routes);
    await sleep(5000);

    return config
}
