// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract TransferHelper {
    function to(address payable addr) external payable {
        return addr.transfer(msg.value);
    }
}
