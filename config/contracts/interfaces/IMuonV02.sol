// SPDX-License-Identifier: MIT

pragma solidity 0.8.12;
pragma experimental ABIEncoderV2;

interface IMuonV02 {
    struct SchnorrSign {
        uint256 signature;
        address owner;
        address nonce;
    }

    function verify(
        bytes calldata reqId,
        uint256 hash,
        SchnorrSign[] calldata _sigs
    ) external returns (bool);
}
