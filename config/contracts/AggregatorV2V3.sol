// Be name Khoda
// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.12;

import {AggregatorV2V3Interface} from "./interfaces/Aggregator.sol";

contract AggregatorV2V3 is AggregatorV2V3Interface {
    mapping(uint80 => RoundData) public rounds;
    uint80 public nextRoundId;

    string public description;
    uint256 public version;
    uint8 public decimals;

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
