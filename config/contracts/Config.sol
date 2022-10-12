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
// MRM: https://github.com/smrm-dev

pragma solidity 0.8.12;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IConfig, IMuonV02} from "./interfaces/IConfig.sol";
import {Checker} from "./libraries/Checker.sol";

/// @title Used for Muon token price feed configuration
/// @author DEUS Finance
contract Config is IConfig, AccessControl {
    using Checker for Route;

    mapping(uint256 => Route) public routes;
    uint256 public routesCount;

    string public description;

    address public muon;
    uint32 public appId;
    uint256 public minimumRequiredSignatures; // minimum signatures required to verify a signature
    uint256 public validEpoch; // signatures expiration time in seconds
    uint256 public validPriceGap;

    bytes32 public constant SETTER_ROLE = keccak256("SETTER_ROLE");

    modifier hasValidLength(Route storage route) {
        _;
        route._checkReversedLength();
        route._checkFPTLength();
        route._checkMTSLength();
        route._checkMTFLength();
    }

    constructor(
        string memory description_,
        uint256 validPriceGap_,
        address muon_,
        uint32 appId_,
        uint256 minimumRequiredSignatures_,
        uint256 validEpoch_,
        address setter,
        address admin
    ) {
        description = description_;
        validPriceGap = validPriceGap_;
        muon = muon_;
        appId = appId_;
        validEpoch = validEpoch_;
        minimumRequiredSignatures = minimumRequiredSignatures_;

        _setupRole(SETTER_ROLE, setter);
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice sets muon contract address
    /// @param muon_ address of the Muon contract
    function setMuon(address muon_) external onlyRole(SETTER_ROLE) {
        emit SetMuon(muon, muon_);
        muon = muon_;
    }

    /// @notice sets muon app id
    /// @param appId_ muon app id
    function setAppId(uint32 appId_) external onlyRole(SETTER_ROLE) {
        emit SetAppId(appId, appId_);
        appId = appId_;
    }

    /// @notice sets minimum signatures required to verify a signature
    /// @param minimumRequiredSignatures_ number of signatures required to verify a signature
    function setMinimumRequiredSignatures(uint256 minimumRequiredSignatures_)
        external
        onlyRole(SETTER_ROLE)
    {
        emit SetMinimumRequiredSignatures(
            minimumRequiredSignatures,
            minimumRequiredSignatures_
        );
        minimumRequiredSignatures = minimumRequiredSignatures_;
    }

    /// @notice sets valid price gap between routes prices
    /// @param validPriceGap_ valid price gap
    function setValidPriceGap(uint256 validPriceGap_)
        external
        onlyRole(SETTER_ROLE)
    {
        emit SetValidPriceGap(validPriceGap, validPriceGap_);
        validPriceGap = validPriceGap_;
    }

    /// @notice sets signatures expiration time in seconds
    /// @param validEpoch_ signatures expiration time in seconds
    function setValidEpoch(uint256 validEpoch_) external onlyRole(SETTER_ROLE) {
        emit SetValidEpoch(validEpoch, validEpoch_);
        validEpoch = validEpoch_;
    }

    /// @notice Edit route in routes based on index
    /// @param index Index of route
    /// @param dex Dex name of route
    /// @param path Path of route
    /// @param config Config of route
    function _setRoute(
        uint256 index,
        string memory dex,
        address[] memory path,
        Config memory config
    ) internal hasValidLength(routes[index]) {
        routes[index] = Route({
            index: index,
            dex: dex,
            path: path,
            config: config
        });

        emit SetRoute(index, dex, path, config);
    }

    /// @notice Add new route to routes
    /// @param dex Dex name of route
    /// @param path Path of route
    /// @param config Config of route
    function addRoute(
        string memory dex,
        address[] memory path,
        Config memory config
    ) external onlyRole(SETTER_ROLE) {
        _setRoute(routesCount, dex, path, config);
        routesCount += 1;
    }

    /// @notice Update a route
    /// @param index Index of route
    /// @param dex Dex name of route
    /// @param path Path of route
    /// @param config Config of route
    function updateRoute(
        uint256 index,
        string memory dex,
        address[] memory path,
        Config memory config
    ) external onlyRole(SETTER_ROLE) {
        require(index < routesCount, "Config: INDEX_OUT_OF_RANGE");
        _setRoute(index, dex, path, config);
    }

    /// @notice Sets fusePriceTolerance for route with index
    /// @param index Index of route
    /// @param fusePriceTolerance FusePriceTolerance of route
    function setFusePriceTolerance(
        uint256 index,
        uint256[] memory fusePriceTolerance
    ) external onlyRole(SETTER_ROLE) hasValidLength(routes[index]) {
        require(index < routesCount, "Config: INDEX_OUT_OF_RANGE");
        emit SetFusePriceTolerance(
            index,
            routes[index].config.fusePriceTolerance,
            fusePriceTolerance
        );
        routes[index].config.fusePriceTolerance = fusePriceTolerance;
    }

    /// @notice Sets fusePriceTolerance for route with index
    /// @param index Index of route
    /// @param minutesToSeed Minutes used in Muon to calculate seed block of route
    function setMinutesToSeed(uint256 index, uint256[] memory minutesToSeed)
        external
        onlyRole(SETTER_ROLE)
        hasValidLength(routes[index])
    {
        require(index < routesCount, "Config: INDEX_OUT_OF_RANGE");

        emit SetMinutesToSeed(
            index,
            routes[index].config.minutesToSeed,
            minutesToSeed
        );
        routes[index].config.minutesToSeed = minutesToSeed;
    }

    /// @notice Sets fusePriceTolerance for route with index
    /// @param index Index of route
    /// @param minutesToFuse Minutes used in Muon to calculate fuse block of route
    function setMinutesToFuse(uint256 index, uint256[] memory minutesToFuse)
        external
        onlyRole(SETTER_ROLE)
        hasValidLength(routes[index])
    {
        require(index < routesCount, "Config: INDEX_OUT_OF_RANGE");

        emit SetMinutesToFuse(
            index,
            routes[index].config.minutesToFuse,
            minutesToFuse
        );
        routes[index].config.minutesToFuse = minutesToFuse;
    }

    /// @notice Sets weight for route with index
    /// @param index Index of route
    /// @param weight Weight of route
    function setWeight(uint256 index, uint256 weight)
        external
        onlyRole(SETTER_ROLE)
    {
        require(index < routesCount, "Config: INDEX_OUT_OF_RANGE");
        emit SetWeight(index, routes[index].config.weight, weight);
        routes[index].config.weight = weight;
    }

    /// @notice Sets state for route with index
    /// @param index Index of route
    /// @param isActive State of route
    function setIsActive(uint256 index, bool isActive)
        external
        onlyRole(SETTER_ROLE)
    {
        require(index < routesCount, "Config: INDEX_OUT_OF_RANGE");
        emit SetIsActive(index, routes[index].config.isActive, isActive);
        routes[index].config.isActive = isActive;
    }

    // -------------------------- VIEWS ---------------------------

    /// @notice Get List Of Active Routes
    /// @return routes_ List of routes
    function getRoutes() external view returns (Route[] memory routes_) {
        uint256 activeRoutes = 0;
        uint256 i;
        for (i = 0; i < routesCount; i += 1) {
            if (routes[i].config.isActive) activeRoutes += 1;
        }

        routes_ = new Route[](activeRoutes);
        uint256 j = 0;
        for (i = 0; i < routesCount; i += 1) {
            if (routes[i].config.isActive) {
                routes_[j] = routes[i];
                j += 1;
            }
        }
    }
}

// Dar panah khoda
