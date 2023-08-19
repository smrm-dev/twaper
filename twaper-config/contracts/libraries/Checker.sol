// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.12;

import {IConfig} from "../interfaces/IConfig.sol";

library Checker {
    function _checkReversedLength(IConfig.Route storage route) internal view {
        require(
            route.path.length == route.config.reversed.length,
            "Config: INVALID_LENGTH"
        );
    }

    function _checkFPTLength(IConfig.Route storage route) internal view {
        require(
            route.path.length == route.config.fuseTickTolerance.length,
            "Config: INVALID_LENGTH"
        );
    }

    function _checkMTSLength(IConfig.Route storage route) internal view {
        require(
            route.path.length == route.config.minutesToSeed.length,
            "Config: INVALID_LENGTH"
        );
    }

    function _checkMTFLength(IConfig.Route storage route) internal view {
        require(
            route.path.length == route.config.minutesToFuse.length,
            "Config: INVALID_LENGTH"
        );
    }
}
