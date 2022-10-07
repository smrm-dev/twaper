// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.12;

import {IOracleAggregator} from "../interfaces/IOracleAggregator.sol";

library Checker {
    function _checkReversedLength(IOracleAggregator.Route storage route)
        internal
        view
    {
        require(
            route.path.length == route.config.reversed.length,
            "OracleAggregator: INVALID_LENGTH"
        );
    }

    function _checkFPTLength(IOracleAggregator.Route storage route)
        internal
        view
    {
        require(
            route.path.length == route.config.fusePriceTolerance.length,
            "OracleAggregator: INVALID_LENGTH"
        );
    }

    function _checkMTSLength(IOracleAggregator.Route storage route)
        internal
        view
    {
        require(
            route.path.length == route.config.minutesToSeed.length,
            "OracleAggregator: INVALID_LENGTH"
        );
    }

    function _checkMTFLength(IOracleAggregator.Route storage route)
        internal
        view
    {
        require(
            route.path.length == route.config.minutesToFuse.length,
            "OracleAggregator: INVALID_LENGTH"
        );
    }
}
