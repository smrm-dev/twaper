const hre = require("hardhat");
const { deploy, verifyAll } = require("../helpers/deploy_contract");
const sleep = require("../helpers/sleep")

module.exports = async function deployConfig(deployer, { oracleFactory }, verify) {
    const contract = await deploy({
        deployer: deployer,
        contractName: 'Config',
        constructorArguments: [
            oracleFactory
        ]
    })

    if (verify) {
        await sleep(10000);
        await verifyAll();
    }

    return contract
}
