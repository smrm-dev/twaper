const hre = require("hardhat");
const { deploy, verifyAll } = require("../helpers/deploy_contract");
const sleep = require("../helpers/sleep")

module.exports = async function deployConfigFactory(deployer, verify) {
    const contract = await deploy({
        deployer: deployer,
        contractName: 'ConfigFactory',
        constructorArguments: []
    })
    await sleep(5000);

    if (verify) {
        await sleep(10000);
        await verifyAll();
    }

    return contract
}
