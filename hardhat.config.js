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
            paymentSplitterFactory: "",
            transferHelper: "",
        },
        reef_testnet: {
            paymentSplitterFactory: "0x4Dd5bA16e96C693531cEAfE5E13913aa00E3FCAD",
            transferHelper: "0x2c1BB0Cb25dC9234cC3a4a8bF8d70E7249a8f82A",
        },
    },
    mocha: {
        timeout: 150000,
    },
    optimizer: {
        enabled: true,
        runs: 200,
    },
};
