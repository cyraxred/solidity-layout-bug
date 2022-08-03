// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

interface IMark {}

contract P11 is IMark {
    uint8 public p11;
}

contract P12 is P11 {
    uint8 public p12;
}

contract P21 {
    uint8 public p21;
}

contract P22 is P21, IMark {
    uint8 public p22;
}

contract P22a is P21 {
    uint256 public p22;
}

contract V1 is P12 {
    function initializeV1() external {
        p11 = 11;
        p12 = 12;
    }
}

contract V2 is V1, P22 {
    function initializeV2() external {
        p21 = 21;
        p22 = 22;
    }
}

contract V2a is V1, P22a {
    function initializeV2() external {
        p21 = 21;
        p22 = 22;
    }
}