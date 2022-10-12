// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.12;

interface IConfigFactory {
    /* ---- events ---- */

    event DeployConfig(uint256 index, address setter, address admin);
}
