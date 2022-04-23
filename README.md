# Payment Splitter Factory

This project has been created using the [Hardhat-reef-template](https://github.com/reef-defi/hardhat-reef-template).

## Contract addresses

Mainnet:
[0x0](https://reefscan.com/contract/0x0)

Testnet: [0x4Dd5bA16e96C693531cEAfE5E13913aa00E3FCAD](https://testnet.reefscan.com/contract/0x4Dd5bA16e96C693531cEAfE5E13913aa00E3FCAD)

## Installing

Install all dependencies with `yarn`.

## Compile contract

```bash
yarn compile
```

## Deploy contracts

Deploy in testnet:

```bash
yarn deploy:testnet
```

Deploy in mainnet:

```bash
yarn deploy:mainnet
```

## Run tests

Local network:

```bash
yarn test
```

Testnet:

```bash
yarn test:testnet
```

## Use account seeds

In order to use your Reef account to deploy the contracts or run the tests, you have to rename the _.env.example_ file to _.env_ and set your seed words there.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
