const hre = require("hardhat");
const { deploy, verifyAll } = require("../helpers/deploy_contract");
const sleep = require("../helpers/sleep")

module.exports = async function deployOracleAggregator(deployer, { muon, appId, minimumRequiredSignatures, validEpoch, description, decimals, version, setter, admin }, verify) {
    const contract = await deploy({
        deployer: deployer,
        contractName: 'OracleAggregator',
        constructorArguments: [
            muon,
            appId,
            minimumRequiredSignatures,
            validEpoch,
            description,
            decimals,
            version,
            setter,
            admin
        ]
    })

    if (verify) {
        await sleep(10000);
        await verifyAll();
    }

    return contract
}
