// SPDX-License-Identifier: MIT
// Adaptation of the OpenZeppelin Contracts v4.4.1 (finance/PaymentSplitter.sol)
pragma solidity ^0.8.10;

interface IWithdrawal {
    function withdraw() external;
}

/**
 * @title PaymentSplitter
 * @dev This contract allows to split REEF payments among a group of accounts. The sender does not need to be aware
 * that the REEF will be split in this way, since it is handled transparently by the contract.
 *
 * The split can be in equal parts or in any other arbitrary proportion. The way this is specified is by assigning each
 * account to a number of shares. Of all the REEF that this contract receives, each account will then be able to claim
 * an amount proportional to the percentage of total shares they were assigned.
 *
 * `PaymentSplitter` follows a _pull payment_ model. This means that payments are not automatically forwarded to the
 * accounts but kept in this contract, and the actual transfer is triggered as a separate step by calling the {release}
 * function.
 *
 */
contract PaymentSplitter {
    event PaymentReleased(address to, uint256 amount);
    event PaymentReceived(address from, uint256 amount);

    uint256 public totalShares;
    uint256 public totalReleased;

    mapping(address => uint256) public shares;
    mapping(address => uint256) public released;
    address[] public payees;

    /**
     * @dev Creates an instance of `PaymentSplitter` where each account in `_payees` is assigned the number of shares at
     * the matching position in the `_shares` array.
     *
     * All addresses in `_payees` must be non-zero. Both arrays must have the same non-zero length, and there must be no
     * duplicates in `_payees`.
     */
    constructor(address[] memory _payees, uint256[] memory _shares) payable {
        require(
            _payees.length == _shares.length,
            "PaymentSplitter: payees and shares length mismatch"
        );
        require(_payees.length > 0, "PaymentSplitter: no payees");

        for (uint256 i = 0; i < _payees.length; i++) {
            _addPayee(_payees[i], _shares[i]);
        }
    }

    /**
     * @dev The REEF received will be logged with {PaymentReceived} events. Note that these events are not fully
     * reliable: it's possible for a contract to receive REEF without triggering this function. This only affects the
     * reliability of the events, and not the actual splitting of REEF.
     *
     * To learn more about this see the Solidity documentation for
     * https://solidity.readthedocs.io/en/latest/contracts.html#fallback-function[fallback
     * functions].
     */
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    /**
     * @dev Triggers a transfer to `account` of the amount of REEF they are owed, according to their percentage of the
     * total shares and their previous withdrawals.
     */
    function release(address payable account) external {
        require(shares[account] > 0, "PaymentSplitter: account has no shares");

        uint256 totalReceived = address(this).balance + totalReleased;
        uint256 payment = _pendingPayment(account, totalReceived, released[account]);

        require(payment != 0, "PaymentSplitter: account is not due payment");
        require(address(this).balance >= payment, "PaymentSplitter: insufficient balance");

        released[account] += payment;
        totalReleased += payment;

        (bool success, ) = account.call{ value: payment }("");
        require(success, "PaymentSplitter: unable to send value, recipient may have reverted");

        emit PaymentReleased(account, payment);
    }

    /**
     * @dev Withdraws available balance for contract with address `addr`. To be used with contracts that implement the
     * _pull payment_ model with a _withdrawal()_ function.
     */
    function withdrawFromContract(address addr) external {
        require(shares[msg.sender] > 0, "PaymentSplitter: caller has no shares");
        IWithdrawal(addr).withdraw();
    }

    /**
     * @dev internal logic for computing the pending payment of an `account` given the token historical balances and
     * already released amounts.
     */
    function _pendingPayment(
        address account,
        uint256 totalReceived,
        uint256 alreadyReleased
    ) private view returns (uint256) {
        return (totalReceived * shares[account]) / totalShares - alreadyReleased;
    }

    /**
     * @dev Add a new payee to the contract.
     * @param account The address of the payee to add.
     * @param _shares The number of shares owned by the payee.
     */
    function _addPayee(address account, uint256 _shares) private {
        require(account != address(0), "PaymentSplitter: account is the zero address");
        require(_shares > 0, "PaymentSplitter: shares are 0");
        require(shares[account] == 0, "PaymentSplitter: account already has shares");

        payees.push(account);
        shares[account] = _shares;
        totalShares += _shares;
    }
}
