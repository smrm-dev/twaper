// Be name Khoda
// SPDX-License-Identifier: GPL-3.0

// =================================================================================================================
//  _|_|_|    _|_|_|_|  _|    _|    _|_|_|      _|_|_|_|  _|                                                       |
//  _|    _|  _|        _|    _|  _|            _|            _|_|_|      _|_|_|  _|_|_|      _|_|_|    _|_|       |
//  _|    _|  _|_|_|    _|    _|    _|_|        _|_|_|    _|  _|    _|  _|    _|  _|    _|  _|        _|_|_|_|     |
//  _|    _|  _|        _|    _|        _|      _|        _|  _|    _|  _|    _|  _|    _|  _|        _|           |
//  _|_|_|    _|_|_|_|    _|_|    _|_|_|        _|        _|  _|    _|    _|_|_|  _|    _|    _|_|_|    _|_|_|     |
// =================================================================================================================
// ================ Oracle Factory ================
// ===============================================
// DEUS Finance: https://github.com/deusfinance

pragma solidity 0.8.12;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./OracleAggregator.sol";

/// @title Deploy Oracles and keep track of it
/// @author DEUS Finance
contract OracleFactory is AccessControl {
    event DeployOracle(
        uint256 index,
        address token,
        address setter,
        address admin
    );

    event SetMuon(address oldValue, address newValue);
    event SetMinimumRequiredSignatures(uint256 oldValue, uint256 newValue);
    event SetAppId(uint32 oldValue, uint32 newValue);
    event SetValidEpoch(uint256 oldValue, uint256 newValue);

    address public muon;
    uint32 public aggregatorMuonAppId;
    uint256 public minimumRequiredSignatures;
    uint256 public validEpoch;

    mapping(address => address) public deployedOracles;
    mapping(uint256 => address) public tokens;
    uint256 public deployedOraclesCount;

    bytes32 public constant DEPLOYER_ROLE = keccak256("DEPLOYER_ROLE");
    bytes32 public constant SETTER_ROLE = keccak256("SETTER_ROLE");

    constructor(
        address muon_,
        uint32 aggregatorMuonAppId_,
        uint256 minimumRequiredSignatures_,
        uint256 validEpoch_,
        address deployer,
        address setter,
        address admin
    ) {
        require(
            muon_ != address(0) &&
                deployer != address(0) &&
                setter != address(0) &&
                admin != address(0),
            "OracleFactory: ZERO_ADDRESS"
        );

        muon = muon_;
        aggregatorMuonAppId = aggregatorMuonAppId_;
        minimumRequiredSignatures = minimumRequiredSignatures_;
        validEpoch = validEpoch_;

        _setupRole(DEPLOYER_ROLE, deployer);
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
        emit SetAppId(aggregatorMuonAppId, appId_);

        aggregatorMuonAppId = appId_;
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

    /// @notice sets signatures expiration time in seconds
    /// @param validEpoch_ signatures expiration time in seconds
    function setValidEpoch(uint256 validEpoch_) external onlyRole(SETTER_ROLE) {
        emit SetValidEpoch(validEpoch, validEpoch_);

        validEpoch = validEpoch_;
    }

    /// @notice Depolys oracle
    /// @param setter Setter role of oracle
    /// @param admin Admin role of oracle
    function deployOracle(
        address token,
        string memory description,
        uint8 decimals,
        uint256 version,
        address setter,
        address admin
    ) public onlyRole(DEPLOYER_ROLE) {
        OracleAggregator oracleAggregator = new OracleAggregator(
            token,
            muon,
            aggregatorMuonAppId,
            minimumRequiredSignatures,
            validEpoch,
            description,
            decimals,
            version,
            setter,
            admin
        );
        tokens[deployedOraclesCount] = token;
        deployedOracles[token] = address(oracleAggregator);
        emit DeployOracle(deployedOraclesCount, token, setter, admin);
        deployedOraclesCount += 1;
    }
}

// Dar panah khoda