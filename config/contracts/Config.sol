// Be name Khoda
// SPDX-License-Identifier: GPL-3.0

// =================================================================================================================
//  _|_|_|    _|_|_|_|  _|    _|    _|_|_|      _|_|_|_|  _|                                                       |
//  _|    _|  _|        _|    _|  _|            _|            _|_|_|      _|_|_|  _|_|_|      _|_|_|    _|_|       |
//  _|    _|  _|_|_|    _|    _|    _|_|        _|_|_|    _|  _|    _|  _|    _|  _|    _|  _|        _|_|_|_|     |
//  _|    _|  _|        _|    _|        _|      _|        _|  _|    _|  _|    _|  _|    _|  _|        _|           |
//  _|_|_|    _|_|_|_|    _|_|    _|_|_|        _|        _|  _|    _|    _|_|_|  _|    _|    _|_|_|    _|_|_|     |
// =================================================================================================================
// ================ Config ================
// ===============================================
// DEUS Finance: https://github.com/deusfinance

// Primary Author(s)
// Seyed: https://github.com/smrm-dev

pragma solidity 0.8.12;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {IOracleFactory} from "./interfaces/IOracleFactory.sol";
import {IOracleAggregator} from "./interfaces/IOracleAggregator.sol";

/// @title Provides token routes for muon
/// @author DEUS Finance
contract Config is AccessControl {
    address public oracleFactory;

    bytes32 public constant SETTER_ROLE = keccak256("SETTER_ROLE");

    constructor(address oracleFactory_) {
        require(oracleFactory_ != address(0), "Config: ZERO_ADDRESS");
        oracleFactory = oracleFactory_;

        _setupRole(SETTER_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function getRoutes(address token, bool dynamicWeight)
        external
        view
        returns (uint256 validPriceGap, IOracleAggregator.Route[] memory routes)
    {
        IOracleAggregator oracle = IOracleAggregator(
            IOracleFactory(oracleFactory).deployedOracles(token)
        );
        return (oracle.validPriceGap(), oracle.getRoutes(dynamicWeight));
    }
}
