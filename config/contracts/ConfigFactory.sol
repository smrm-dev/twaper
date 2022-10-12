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

pragma solidity 0.8.12;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Config} from "./Config.sol";
import {IConfigFactory} from "./interfaces/IConfigFactory.sol";

/// @title Deploy Configs and keep track of it
/// @author DEUS Finance
contract ConfigFactory is IConfigFactory, AccessControl {
    address public muon;
    uint32 public aggregatorMuonAppId;
    uint256 public minimumRequiredSignatures;
    uint256 public validEpoch;

    mapping(uint256 => address) public deployedConfigs;
    uint256 public deployedConfigsCount;

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
            "ConfigFactory: ZERO_ADDRESS"
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

    /// @notice Depolys config
    /// @param setter Setter role of config
    /// @param admin Admin role of config
    function deployConfig(
        string memory description,
        uint256 validPriceGap,
        address setter,
        address admin
    ) public onlyRole(DEPLOYER_ROLE) {
        Config config = new Config(
            description,
            validPriceGap,
            muon,
            aggregatorMuonAppId,
            minimumRequiredSignatures,
            validEpoch,
            setter,
            admin
        );
        deployedConfigs[deployedConfigsCount] = address(config);
        emit DeployConfig(deployedConfigsCount, setter, admin);
        deployedConfigsCount += 1;
    }
}

// Dar panah khoda
