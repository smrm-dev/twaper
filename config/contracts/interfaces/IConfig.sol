// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.12;
pragma experimental ABIEncoderV2;

interface IConfig {
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

    /* ---- events ---- */

    event SetRoute(uint256 index, string dex, address[] path, Config config);
    event SetDex(uint256 index, string oldValue, string newValue);
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
    event SetValidPriceGap(uint256 oldValue, uint256 newValue);
}
