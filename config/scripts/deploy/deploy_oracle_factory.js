const hre = require("hardhat");
const { deploy, verifyAll } = require("../helpers/deploy_contract");
const sleep = require("../helpers/sleep")

module.exports = async function deployOracleFactory(deployer, {
    muon,
    aggregatorMuonAppId,
    minimumRequiredSignatures,
    validEpoch,
    oracleDeployer,
    setter,
    admin
}, verify) {
    const contract = await deploy({
        deployer: deployer,
        contractName: 'OracleFactory',
        constructorArguments: [
            muon,
            aggregatorMuonAppId,
            minimumRequiredSignatures,
            validEpoch,
            oracleDeployer,
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
