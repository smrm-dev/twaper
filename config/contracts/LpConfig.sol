// Be name Khoda
// SPDX-License-Identifier: GPL-3.0

// =================================================================================================================
//  _|_|_|    _|_|_|_|  _|    _|    _|_|_|      _|_|_|_|  _|                                                       |
//  _|    _|  _|        _|    _|  _|            _|            _|_|_|      _|_|_|  _|_|_|      _|_|_|    _|_|       |
//  _|    _|  _|_|_|    _|    _|    _|_|        _|_|_|    _|  _|    _|  _|    _|  _|    _|  _|        _|_|_|_|     |
//  _|    _|  _|        _|    _|        _|      _|        _|  _|    _|  _|    _|  _|    _|  _|        _|           |
//  _|_|_|    _|_|_|_|    _|_|    _|_|_|        _|        _|  _|    _|    _|_|_|  _|    _|    _|_|_|    _|_|_|     |
// =================================================================================================================
// ================ Lp Config ================
// ===============================================
// DEUS Finance: https://github.com/deusfinance

// Primary Author(s)
// MRM: https://github.com/smrm-dev

pragma solidity 0.8.12;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IConfig} from "./interfaces/IConfig.sol";
import {IUniswapV2Pair} from "./interfaces/IUniswapV2Pair.sol";
import {Checker} from "./libraries/Checker.sol";

/// @title Used for Muon token price feed app configuration
/// @author DEUS Finance
contract LpConfig is AccessControl {
    address public pair;
    address public config0;
    address public config1;
    string public description;

    bytes32 public constant SETTER_ROLE = keccak256("SETTER_ROLE");

    event SetConfig(address config0, address config1);

    struct ConfigMetaData {
        IConfig.Route[] routes;
        uint256 validPriceGap_;
    }

    struct LpMetaData {
        address pair;
        ConfigMetaData config0;
        ConfigMetaData config1;
    }

    constructor(
        address pair_,
        address config0_,
        address config1_,
        string memory description_,
        address setter,
        address admin
    ) {
        pair = pair_;
        config0 = config0_;
        config1 = config1_;
        description = description_;

        _setupRole(SETTER_ROLE, setter);
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice Sets configs of the pair
    /// @param config0_ Address of config0
    /// @param config1_ Address of config1
    function setConfig(address config0_, address config1_) external onlyRole(SETTER_ROLE) {
        config0 = config0_;
        config1 = config1_;

        emit SetConfig(config0, config1);
    }

    // -------------------------- VIEWS --------------------------- //

    /// @notice Get Lp configuration
    function getMetaData() external view returns (LpMetaData memory) {
        ConfigMetaData memory config0_;
        ConfigMetaData memory config1_;

        if (config0 != address(0)) 
            (config0_.validPriceGap_, config0_.routes) = IConfig(config0).getRoutes();
        
        if (config1 != address(0))
            (config1_.validPriceGap_, config1_.routes) = IConfig(config1).getRoutes();

        return LpMetaData({
                pair: pair,
                config0: config0_,
                config1: config1_
        });
    }
}
