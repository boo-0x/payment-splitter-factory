require("dotenv").config();
require("@reef-defi/hardhat-reef");
require("@primitivefi/hardhat-dodoc");
require("hardhat-contract-sizer");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await reef.getSigners();

    for (const account of accounts) {
        console.log(await account.getAddress());
    }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.10",
            },
        ],
    },
    defaultNetwork: "reef",
    networks: {
        reef: {
            url: "ws://127.0.0.1:9944",
            scanUrl: "http://localhost:8000",
        },
        reef_testnet: {
            url: "wss://rpc-testnet.reefscan.com/ws",
            scanUrl: "https://testnet.reefscan.com",
            seeds: {
                account1: process.env.ACCOUNT_1,
                account2: process.env.ACCOUNT_2,
                account3: process.env.ACCOUNT_3,
            },
        },
        reef_mainnet: {
            url: "wss://rpc.reefscan.com/ws",
            scanUrl: "https://reefscan.com",
            seeds: {
                account1: process.env.MAINNET_ACCOUNT,
            },
        },
    },
    contracts: {
        reef: {
            paymentSplitterFactory: "0x0230135fDeD668a3F7894966b14F42E65Da322e4",
            transferHelper: "0x546411ddd9722De71dA1B836327b37D840F16059",
            pullPayment: "0xD3ba2aA7dfD7d6657D5947f3870A636c7351EfE4",
        },
        reef_testnet: {
            paymentSplitterFactory: "0x5c6713098D692399D5eecb6Ef54c69E60512fcbF",
            transferHelper: "0x2c1BB0Cb25dC9234cC3a4a8bF8d70E7249a8f82A",
            pullPayment: "0x8425da8A15Dc9F5395dBa0C8C4D2116d80FA3aA9",
        },
    },
    contractSizer: {
        except: ["/test"],
    },
    mocha: {
        timeout: 150000,
    },
    optimizer: {
        enabled: true,
        runs: 200,
    },
};
