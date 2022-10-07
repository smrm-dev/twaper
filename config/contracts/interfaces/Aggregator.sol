// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "./AggregatorInterface.sol";
import "./AggregatorV3Interface.sol";

interface AggregatorV2V3Interface is
    AggregatorInterface,
    AggregatorV3Interface
{
    struct RoundData {
        uint80 roundId;
        int256 answer;
        uint256 startedAt;
        uint256 updatedAt;
        uint80 answeredInRound;
    }
}
