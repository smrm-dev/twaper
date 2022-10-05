// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.12;

interface IOracleFactory {
    function deployedOracles(address token)
        external
        view
        returns (address oracle);
}
