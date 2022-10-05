// Be name Khoda
// SPDX-License-Identifier: GPL-3.0

// =================================================================================================================
//  _|_|_|    _|_|_|_|  _|    _|    _|_|_|      _|_|_|_|  _|                                                       |
//  _|    _|  _|        _|    _|  _|            _|            _|_|_|      _|_|_|  _|_|_|      _|_|_|    _|_|       |
//  _|    _|  _|_|_|    _|    _|    _|_|        _|_|_|    _|  _|    _|  _|    _|  _|    _|  _|        _|_|_|_|     |
//  _|    _|  _|        _|    _|        _|      _|        _|  _|    _|  _|    _|  _|    _|  _|        _|           |
//  _|_|_|    _|_|_|_|    _|_|    _|_|_|        _|        _|  _|    _|    _|_|_|  _|    _|    _|_|_|    _|_|_|     |
// =================================================================================================================
// ================ Oracle Aggregator ================
// ===============================================
// DEUS Finance: https://github.com/deusfinance

// Primary Author(s)
// MMD: https://github.com/mmd-mostafaee

pragma solidity 0.8.12;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/Aggregator.sol";
import "./interfaces/IMuonV02.sol";

/// @title Used to configure MUON off-chain aggregator
/// @author DEUS Finance
contract OracleAggregator is AccessControl, AggregatorV2V3Interface {
    /* ---- events ---- */

    event SetRoute(uint256 index, string dex, address[] path, Config config);
    event SetDex(uint256 index, string oldValue, string newValue);
    event SetPath(uint256 index, address[] oldValue, address[] newValue);
    event SetReversed(uint256 index, bool[] oldValue, bool[] newValue);
    event SetFusePriceTolerance(
        uint256 index,
        uint256[] oldValue,
        uint256[] newValue
    );
    event SetWeight(uint256 index, uint256 oldValue, uint256 newValue);
    event SetIsActive(uint256 index, bool oldValue, bool newValue);
    event SetMuon(address oldValue, address newValue);
    event SetMinimumRequiredSignatures(uint256 oldValue, uint256 newValue);
    event SetAppId(uint32 oldValue, uint32 newValue);
    event SetValidEpoch(uint256 oldValue, uint256 newValue);
    event SetValidPriceGap(uint256 oldValue, uint256 newValue);

    /* ---- structs ---- */

    struct Config {
        bool[] reversed;
        uint256[] fusePriceTolerance;
        uint256 weight;
        bool isActive;
    }

    struct Route {
        uint256 index;
        string dex;
        address[] path;
        Config config;
    }

    struct RoundData {
        uint80 roundId;
        int256 answer;
        uint256 startedAt;
        uint256 updatedAt;
        uint80 answeredInRound;
    }

    struct Signature {
        int256 price;
        uint256 timestamp;
        bytes reqId;
        IMuonV02.SchnorrSign[] sigs;
    }

    mapping(uint80 => RoundData) public rounds;
    uint80 public nextRoundId;

    mapping(uint256 => Route) public routes;
    uint256 public routesCount;

    address public muon;
    uint32 public appId;
    uint256 public minimumRequiredSignatures; // minimum signatures required to verify a signature
    uint256 public validEpoch; // signatures expiration time in seconds

    address public token;
    uint256 public validPriceGap;
    string public description;
    uint256 public version;
    uint8 public decimals;

    bytes32 public constant SETTER_ROLE = keccak256("SETTER_ROLE");

    constructor(
        address token_,
        uint256 validPriceGap_,
        address muon_,
        uint32 appId_,
        uint256 minimumRequiredSignatures_,
        uint256 validEpoch_,
        string memory description_,
        uint8 decimals_,
        uint256 version_,
        address setter,
        address admin
    ) {
        token = token_;
        validPriceGap = validPriceGap_;
        muon = muon_;
        appId = appId_;
        validEpoch = validEpoch_;
        minimumRequiredSignatures = minimumRequiredSignatures_;

        description = description_;
        version = version_;
        decimals = decimals_;

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
    ) internal {
        require(
            path.length == config.reversed.length,
            "OracleAggregator: INVALID_REVERSED_LENGTH"
        );
        require(
            path.length == config.fusePriceTolerance.length,
            "OracleAggregator: INVALID_FPT_LENGTH"
        );
        routes[index] = Route({
            index: index,
            dex: dex,
            path: path,
            config: config
        });

        emit SetRoute(index, dex, path, config);
    }

    /// @notice Add new Route to routes
    /// @param dex Dex name of route
    /// @param path Path of route
    /// @param config Config of route
    function addRoute(
        string memory dex,
        address[] memory path,
        Config memory config
    ) public onlyRole(SETTER_ROLE) {
        _setRoute(routesCount, dex, path, config);
        routesCount += 1;
    }

    /// @notice Update new Route to routes
    /// @param index Index of route
    /// @param dex Dex name of route
    /// @param path Path of route
    /// @param config Config of route
    function updateRoute(
        uint256 index,
        string memory dex,
        address[] memory path,
        Config memory config
    ) public onlyRole(SETTER_ROLE) {
        require(index < routesCount, "OracleAggregator: INDEX_OUT_OF_RANGE");
        _setRoute(index, dex, path, config);
    }

    /// @notice Sets dex for route with index
    /// @param index Index of route
    /// @param dex Dex of route
    function setDex(uint256 index, string memory dex)
        public
        onlyRole(SETTER_ROLE)
    {
        require(index < routesCount, "OracleAggregator: INDEX_OUT_OF_RANGE");
        emit SetDex(index, routes[index].dex, dex);
        routes[index].dex = dex;
    }

    /// @notice Sets path for route with index
    /// @param index Index of route
    /// @param path Path of route
    function setPath(uint256 index, address[] memory path)
        public
        onlyRole(SETTER_ROLE)
    {
        require(index < routesCount, "OracleAggregator: INDEX_OUT_OF_RANGE");
        require(
            path.length == routes[index].path.length,
            "OracleAggregator: INVALID_PATH_LENGTH"
        );
        emit SetPath(index, routes[index].path, path);
        routes[index].path = path;
    }

    /// @notice Sets path for route with index
    /// @param index Index of route
    /// @param reversed Reversed of route
    function setReversed(uint256 index, bool[] memory reversed)
        public
        onlyRole(SETTER_ROLE)
    {
        require(index < routesCount, "OracleAggregator: INDEX_OUT_OF_RANGE");
        require(
            routes[index].path.length == reversed.length,
            "OracleAggregator: INVALID_PATH_LENGTH"
        );
        emit SetReversed(index, routes[index].config.reversed, reversed);
        routes[index].config.reversed = reversed;
    }

    /// @notice Sets fusePriceTolerance for route with index
    /// @param index Index of route
    /// @param fusePriceTolerance FusePriceTolerance of route
    function setFusePriceTolerance(
        uint256 index,
        uint256[] memory fusePriceTolerance
    ) public onlyRole(SETTER_ROLE) {
        require(index < routesCount, "OracleAggregator: INDEX_OUT_OF_RANGE");
        require(
            routes[index].path.length == fusePriceTolerance.length,
            "OracleAggregator: INVALID_PATH_LENGTH"
        );
        emit SetFusePriceTolerance(
            index,
            routes[index].config.fusePriceTolerance,
            fusePriceTolerance
        );
        routes[index].config.fusePriceTolerance = fusePriceTolerance;
    }

    /// @notice Sets weight for route with index
    /// @param index Index of route
    /// @param weight Weight of route
    function setWeight(uint256 index, uint256 weight)
        public
        onlyRole(SETTER_ROLE)
    {
        require(index < routesCount, "OracleAggregator: INDEX_OUT_OF_RANGE");
        emit SetWeight(index, routes[index].config.weight, weight);
        routes[index].config.weight = weight;
    }

    /// @notice Sets state for route with index
    /// @param index Index of route
    /// @param isActive State of route
    function setIsActive(uint256 index, bool isActive)
        public
        onlyRole(SETTER_ROLE)
    {
        require(index < routesCount, "OracleAggregator: INDEX_OUT_OF_RANGE");
        emit SetIsActive(index, routes[index].config.isActive, isActive);
        routes[index].config.isActive = isActive;
    }

    // ------------------------- PUBLIC FUNCTIONS -----------------

    /// @notice Sets price for given collateral
    /// @param signature signature to verify
    function setPrice(Signature calldata signature) public {
        require(
            signature.sigs.length >= minimumRequiredSignatures,
            "OracleAggregator: INSUFFICIENT_SIGNATURES"
        );
        require(
            signature.timestamp + validEpoch >= block.timestamp,
            "OracleAggregator: SIGNATURE_EXPIRED"
        );
        require(
            signature.timestamp > latestTimestamp(),
            "OracleAggregator: INVALID_SIGNATURE"
        );

        bytes32 hash = keccak256(
            abi.encodePacked(appId, signature.price, signature.timestamp)
        );

        require(
            IMuonV02(muon).verify(
                signature.reqId,
                uint256(hash),
                signature.sigs
            ),
            "OracleAggregator: UNVERIFIED_SIGNATURES"
        );

        RoundData memory round = RoundData({
            roundId: nextRoundId,
            answer: signature.price,
            startedAt: block.timestamp,
            updatedAt: block.timestamp,
            answeredInRound: nextRoundId
        });
        rounds[nextRoundId] = round;
        nextRoundId++;
    }

    // -------------------------- VIEWS ---------------------------

    /// @notice Get List Of Active Routes
    /// @param dynamicWeight use pair reserve as weight
    /// @return routes_ List of routes
    function getRoutes(bool dynamicWeight)
        public
        view
        returns (Route[] memory routes_)
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

        if (dynamicWeight) {
            for (i = 0; i < activeRoutes; i += 1) {
                routes_[i].config.weight = IERC20(token).balanceOf(
                    routes_[i].path[0]
                );
            }
        }
    }

    function getRoundData(uint80 _roundId)
        public
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        require(_roundId < nextRoundId, "OracleAggregator: INDEX_OUT_OF_RANGE");
        RoundData memory _round = rounds[_roundId];
        return (
            _round.roundId,
            _round.answer,
            _round.startedAt,
            _round.updatedAt,
            _round.answeredInRound
        );
    }

    function latestRoundData()
        public
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return getRoundData(nextRoundId - 1);
    }

    function latestAnswer() external view returns (int256) {
        (, int256 answer, , , ) = latestRoundData();
        return answer;
    }

    function latestTimestamp() public view returns (uint256) {
        (, , , uint256 updatedAt, ) = latestRoundData();
        return updatedAt;
    }

    function latestRound() external view returns (uint256) {
        return nextRoundId - 1;
    }

    function getAnswer(uint256 roundId) external view returns (int256) {
        (, int256 answer, , , ) = getRoundData(uint80(roundId));
        return answer;
    }

    function getTimestamp(uint256 roundId) external view returns (uint256) {
        (, , , uint256 updatedAt, ) = getRoundData(uint80(roundId));
        return updatedAt;
    }
}

// Dar panah khoda
