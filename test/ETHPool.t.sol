// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/ETHPool.sol";

contract TokenTest is Test {
    ETHPool ethpool;

    function setUp() public {
        ethpool = new ETHPool();
    }

    function testCanDeposit() public {
        assertEq(ethpool.getPoolBalance(), 0);
    }
}
