const hre = require("hardhat");

async function setBalance(account, balance = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff") {
    await hre.network.provider.request({
        method: "hardhat_setBalance",
        params: [
            account,
            balance,
        ]
    });
}

async function impersonate(account) {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [account],
    });

    return await hre.ethers.getSigner(account)
}

async function getBalanceOf(tokenAddress, address, removeDecimals = false) {
    const ERC20 = await hre.ethers.getContractFactory("@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20");
    const token = ERC20.attach(tokenAddress);
    let balance = await token.balanceOf(address)
    if (removeDecimals) {
        balance /= 10 ** (await token.decimals())
    }
    return balance
}

async function approve(tokenAddress, signer, spender) {
    const ERC20 = await hre.ethers.getContractFactory("ERC20", signer);
    const token = ERC20.attach(tokenAddress);
    return token.approve(spender, BigInt(1e30));
}

async function transfer(tokenAddress, fromAddress, toAddress, amount) {
    const signer = await impersonate(fromAddress)
    const ERC20 = await hre.ethers.getContractFactory("ERC20", signer);
    const token = ERC20.attach(tokenAddress);
    await token.transfer(toAddress, amount)
}

module.exports = {
    impersonate,
    transfer,
    getBalanceOf,
    setBalance,
    approve
}