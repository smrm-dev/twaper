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
contract ConfigFactory is IConfigFactory, AccessControl {
    mapping(uint256 => address) public deployedConfigs;
    uint256 public deployedConfigsCount;

    bytes32 public constant DEPLOYER_ROLE = keccak256("DEPLOYER_ROLE");
    bytes32 public constant SETTER_ROLE = keccak256("SETTER_ROLE");

    constructor(
        address deployer,
        address setter,
        address admin
    ) {
        require(
            deployer != address(0) &&
                setter != address(0) &&
                admin != address(0),
            "ConfigFactory: ZERO_ADDRESS"
        );

        _setupRole(DEPLOYER_ROLE, deployer);
        _setupRole(SETTER_ROLE, setter);
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice Depolys config
    /// @param setter Setter role of config
    /// @param admin Admin role of config
    function deployConfig(
        string memory description,
        uint256 validPriceGap,
        address setter,
        address admin
    ) public onlyRole(DEPLOYER_ROLE) {
        Config config = new Config(description, validPriceGap, setter, admin);
        deployedConfigs[deployedConfigsCount] = address(config);
        emit DeployConfig(deployedConfigsCount, setter, admin);
        deployedConfigsCount += 1;
    }
}

// Dar panah khoda
