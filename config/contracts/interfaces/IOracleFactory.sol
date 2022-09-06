// Be name Khoda
// SPDX-License-Identifier: GPL-3.0

interface IOracleFactory {
    function deployedOracles(address token)
        external
        view
        returns (address oracle);
}
