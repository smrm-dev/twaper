// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.12;

interface IOracleFactory {
    /* ---- events ---- */

    event DeployOracle(uint256 index, address setter, address admin);
    event SetMuon(address oldValue, address newValue);
    event SetMinimumRequiredSignatures(uint256 oldValue, uint256 newValue);
    event SetAppId(uint32 oldValue, uint32 newValue);
    event SetValidEpoch(uint256 oldValue, uint256 newValue);

    /* ---- functions ---- */

    function deployedOracles(uint256 index)
        external
        view
        returns (address oracle);
}
