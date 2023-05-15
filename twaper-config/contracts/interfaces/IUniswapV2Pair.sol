// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.12;

interface IUniswapV2Pair {
    function getReserves()
        external
        view
        returns (
            uint112 _reserve0,
            uint112 _reserve1,
            uint32 _blockTimestampLast
        );

    function totalSupply() external view returns (uint256);
}
