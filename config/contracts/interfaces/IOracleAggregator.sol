// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.12;
pragma experimental ABIEncoderV2;

import {IMuonV02} from "./IMuonV02.sol";

interface IOracleAggregator {
    /* ---- structs ---- */

    struct Config {
        bool[] reversed;
        uint256[] fusePriceTolerance;
        uint256[] minutesToSeed;
        uint256[] minutesToFuse;
        uint256 weight;
        bool isActive;
    }

    struct Route {
        uint256 index;
        string dex;
        address[] path;
        Config config;
    }

    struct Signature {
        int256 price;
        uint256 timestamp;
        bytes reqId;
        IMuonV02.SchnorrSign[] sigs;
    }

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
    event SetMinutesToSeed(
        uint256 index,
        uint256[] oldValue,
        uint256[] newValue
    );
    event SetMinutesToFuse(
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

    /* ---- functions ---- */

    function validPriceGap() external view returns (uint256);

    function getRoutes(bool dynamicWeight)
        external
        view
        returns (Route[] memory routes_);
}
