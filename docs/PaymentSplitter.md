# PaymentSplitter



> PaymentSplitter



*This contract allows to split Reef payments among a group of accounts. The sender does not need to be aware that the Reef will be split in this way, since it is handled transparently by the contract. The split can be in equal parts or in any other arbitrary proportion. The way this is specified is by assigning each account to a number of shares. Of all the Reef that this contract receives, each account will then be able to claim an amount proportional to the percentage of total shares they were assigned. `PaymentSplitter` follows a _pull payment_ model. This means that payments are not automatically forwarded to the accounts but kept in this contract, and the actual transfer is triggered as a separate step by calling the {release} function.*

## Methods

### payees

```solidity
function payees(uint256) external view returns (address)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### release

```solidity
function release(address payable account) external nonpayable
```



*Triggers a transfer to `account` of the amount of Reef they are owed, according to their percentage of the total shares and their previous withdrawals.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address payable | undefined |

### released

```solidity
function released(address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### shares

```solidity
function shares(address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### totalReleased

```solidity
function totalReleased() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### totalShares

```solidity
function totalShares() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |



## Events

### PaymentReceived

```solidity
event PaymentReceived(address from, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from  | address | undefined |
| amount  | uint256 | undefined |

### PaymentReleased

```solidity
event PaymentReleased(address to, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| to  | address | undefined |
| amount  | uint256 | undefined |



