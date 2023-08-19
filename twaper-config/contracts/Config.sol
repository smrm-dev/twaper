// Be name Khoda
// SPDX-License-Identifier: GPL-3.0

// ================ Config ================

// Primary Author(s)
// MRM: https://github.com/smrm-dev

pragma solidity 0.8.12;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IConfig} from "./interfaces/IConfig.sol";
import {Checker} from "./libraries/Checker.sol";

/// @title Used for Muon token price feed app configuration
contract Config is IConfig, AccessControl {
    using Checker for Route;

    mapping(uint256 => Route) public routes;
    uint256 public routesCount;

    string public description;
    uint256 public validTickGap;

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
        uint256 validTickGap_,
        address setter,
        address admin
    ) {
        description = description_;
        validTickGap = validTickGap_;

        _setupRole(SETTER_ROLE, setter);
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice sets valid tick gap between routes ticks
    /// @param validTickGap_ valid tick gap
    function setValidTickGap(
        uint256 validTickGap_
    ) external onlyRole(SETTER_ROLE) {
        emit SetValidTickGap(validTickGap, validTickGap_);
        validTickGap = validTickGap_;
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
        routes[index] = Route({dex: dex, path: path, config: config});

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
    ) internal onlyRole(SETTER_ROLE) {
        _setRoute(routesCount, dex, path, config);
        routesCount += 1;
    }

    function addRoutes(Route[] memory _routes) external onlyRole(SETTER_ROLE) {
        for (uint i = 0; i < _routes.length; i++) {
            Route memory route = _routes[i];
            addRoute(route.dex, route.path, route.config);
        }
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

    /// @notice Sets fuseTickTolerance for route with index
    /// @param index Index of route
    /// @param fuseTickTolerance FuseTickTolerance of route
    function setFuseTickTolerance(
        uint256 index,
        uint256[] memory fuseTickTolerance
    ) external onlyRole(SETTER_ROLE) hasValidLength(routes[index]) {
        require(index < routesCount, "Config: INDEX_OUT_OF_RANGE");
        emit SetFuseTickTolerance(
            index,
            routes[index].config.fuseTickTolerance,
            fuseTickTolerance
        );
        routes[index].config.fuseTickTolerance = fuseTickTolerance;
    }

    /// @notice Sets minutesToSeed for route with index
    /// @param index Index of route
    /// @param minutesToSeed Minutes used in Muon to calculate seed block of route
    function setMinutesToSeed(
        uint256 index,
        uint256[] memory minutesToSeed
    ) external onlyRole(SETTER_ROLE) hasValidLength(routes[index]) {
        require(index < routesCount, "Config: INDEX_OUT_OF_RANGE");

        emit SetMinutesToSeed(
            index,
            routes[index].config.minutesToSeed,
            minutesToSeed
        );
        routes[index].config.minutesToSeed = minutesToSeed;
    }

    /// @notice Sets minutesToFuse for route with index
    /// @param index Index of route
    /// @param minutesToFuse Minutes used in Muon to calculate fuse block of route
    function setMinutesToFuse(
        uint256 index,
        uint256[] memory minutesToFuse
    ) external onlyRole(SETTER_ROLE) hasValidLength(routes[index]) {
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
    function setWeight(
        uint256 index,
        uint256 weight
    ) external onlyRole(SETTER_ROLE) {
        require(index < routesCount, "Config: INDEX_OUT_OF_RANGE");
        emit SetWeight(index, routes[index].config.weight, weight);
        routes[index].config.weight = weight;
    }

    /// @notice Sets state for route with index
    /// @param index Index of route
    /// @param isActive State of route
    function setIsActive(
        uint256 index,
        bool isActive
    ) external onlyRole(SETTER_ROLE) {
        require(index < routesCount, "Config: INDEX_OUT_OF_RANGE");
        emit SetIsActive(index, routes[index].config.isActive, isActive);
        routes[index].config.isActive = isActive;
    }

    // -------------------------- VIEWS ---------------------------

    /// @notice Get List Of Active Routes
    function getRoutes()
        external
        view
        returns (uint256 validTickGap_, Route[] memory routes_)
    {
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
        return (validTickGap, routes_);
    }
}

// Dar panah khoda
