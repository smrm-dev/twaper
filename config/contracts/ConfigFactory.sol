// Be name Khoda
// SPDX-License-Identifier: GPL-3.0

// =================================================================================================================
//  _|_|_|    _|_|_|_|  _|    _|    _|_|_|      _|_|_|_|  _|                                                       |
//  _|    _|  _|        _|    _|  _|            _|            _|_|_|      _|_|_|  _|_|_|      _|_|_|    _|_|       |
//  _|    _|  _|_|_|    _|    _|    _|_|        _|_|_|    _|  _|    _|  _|    _|  _|    _|  _|        _|_|_|_|     |
//  _|    _|  _|        _|    _|        _|      _|        _|  _|    _|  _|    _|  _|    _|  _|        _|           |
//  _|_|_|    _|_|_|_|    _|_|    _|_|_|        _|        _|  _|    _|    _|_|_|  _|    _|    _|_|_|    _|_|_|     |
// =================================================================================================================
// ================ Config Factory ================
// ===============================================
// DEUS Finance: https://github.com/deusfinance

// Primary Author(s)
// MRM: https://github.com/smrm-dev

pragma solidity 0.8.12;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Config} from "./Config.sol";
import {IConfigFactory} from "./interfaces/IConfigFactory.sol";

/// @title Deploy Configs and keep track of it
/// @author DEUS Finance
contract ConfigFactory is IConfigFactory {
    mapping(uint256 => ConfigDescription) public deployedConfigs;
    uint256 public deployedConfigsCount;

    constructor() {}

    /// @notice Depolys config
    /// @param setter Setter role of config
    /// @param admin Admin role of config
    function deployConfig(
        string memory description,
        uint256 validPriceGap,
        address setter,
        address admin
    ) external {
        Config config = new Config(description, validPriceGap, setter, admin);
        deployedConfigs[deployedConfigsCount] = ConfigDescription({
            addr: address(config),
            description: description
        });
        emit DeployConfig(deployedConfigsCount, setter, admin);
        deployedConfigsCount += 1;
    }
}

// Dar panah khoda
