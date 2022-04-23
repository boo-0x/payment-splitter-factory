//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./PaymentSplitter.sol";

contract PaymentSplitterFactory {
    event PaymentSplitterCreated(address addr);

    function createPaymentSplitter(address[] calldata payees, uint256[] calldata shares_) external {
        PaymentSplitter paymentSplitter = new PaymentSplitter(payees, shares_);
        emit PaymentSplitterCreated(address(paymentSplitter));
    }
}
