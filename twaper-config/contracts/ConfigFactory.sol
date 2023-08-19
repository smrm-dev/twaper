// Be name Khoda
// SPDX-License-Identifier: GPL-3.0

// ================ Config Factory ================

// Primary Author(s)
// MRM: https://github.com/smrm-dev

pragma solidity 0.8.12;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Config} from "./Config.sol";
import {LpConfig} from "./LpConfig.sol";
import {IConfigFactory} from "./interfaces/IConfigFactory.sol";

/// @title Deploy Configs and keep track of it
contract ConfigFactory is IConfigFactory {
    mapping(uint256 => ConfigDescription) public deployedConfigs;
    uint256 public deployedConfigsCount;

    mapping(uint256 => ConfigDescription) public deployedLpConfigs;
    uint256 public deployedLpConfigsCount;

    constructor() {}

    /// @notice Depolys config
    /// @param setter Setter role of config
    /// @param admin Admin role of config
    function deployConfig(
        string memory description,
        uint256 validTickGap,
        address setter,
        address admin
    ) external {
        Config config = new Config(description, validTickGap, setter, admin);
        deployedConfigs[deployedConfigsCount] = ConfigDescription({
            addr: address(config),
            description: description
        });
        emit DeployConfig(deployedConfigsCount, setter, admin);
        deployedConfigsCount += 1;
    }

    /// @notice Depolys lpConfig
    /// @param setter Setter role of config
    /// @param admin Admin role of config
    function deployLpConfig(
        uint256 chainId,
        address pair,
        address config0,
        address config1,
        string memory description,
        address setter,
        address admin
    ) external {
        LpConfig config = new LpConfig(
            chainId,
            pair,
            config0,
            config1,
            description,
            setter,
            admin
        );
        deployedLpConfigs[deployedLpConfigsCount] = ConfigDescription({
            addr: address(config),
            description: description
        });
        emit DeployLpConfig(deployedLpConfigsCount, setter, admin);
        deployedLpConfigsCount += 1;
    }
}

// Dar panah khoda
