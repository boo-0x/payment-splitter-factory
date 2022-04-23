const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("******************* PaymentSplitterFactory *******************", () => {
    let paymentSplitter;

    before(async () => {
        console.log(`Running network => ${hre.network.name}\n`);

        // Get accounts
        [owner, ownerAddress] = await getSignerAndAddress(
            hre.network.name == "reef" ? "alice" : "account1"
        );
        [bob, bobAddress] = await getSignerAndAddress(
            hre.network.name == "reef" ? "bob" : "account2"
        );
        charlie = await reef.getSignerByName(hre.network.name == "reef" ? "charlie" : "account3");
        charlieAddress = await charlie.getAddress();

        // Setup data
        payees = [ownerAddress, bobAddress, charlieAddress];
        shares = [3000, 5000, 2000];
        amountSent = toReef(2000);
        provider = await reef.getProvider();

        // PaymentSplitter contract
        PaymentSplitter = await reef.getContractFactory("PaymentSplitter", owner);

        // PaymentSplitterFactory contract
        const paymentSplitterFactoryAddress =
            config.contracts[hre.network.name].paymentSplitterFactory;
        const PaymentSplitterFactory = await reef.getContractFactory(
            "PaymentSplitterFactory",
            owner
        );
        if (!paymentSplitterFactoryAddress || paymentSplitterFactoryAddress == "") {
            // Deploy
            console.log("\tDeploying PaymentSplitterFactory...");
            paymentSplitterFactory = await PaymentSplitterFactory.deploy();
            await paymentSplitterFactory.deployed();
        } else {
            // Get existing contract
            paymentSplitterFactory = PaymentSplitterFactory.attach(paymentSplitterFactoryAddress);
        }
        console.log(
            `\tPaymentSplitterFactory contact deployed to ${paymentSplitterFactory.address}`
        );

        // TransferHelper contract
        const transferHelperAddress = config.contracts[hre.network.name].transferHelper;
        const TransferHelper = await reef.getContractFactory("TransferHelper", owner);
        if (!transferHelperAddress || transferHelperAddress == "") {
            // Deploy
            console.log("\tDeploying TransferHelper...");
            transferHelper = await TransferHelper.deploy();
            await transferHelper.deployed();
        } else {
            // Get existing contract
            transferHelper = TransferHelper.attach(transferHelperAddress);
        }
        console.log(`\tTransferHelper contact deployed to ${transferHelper.address}`);
    });

    it("Should create new PaymentSplitter contract", async () => {
        const tx = await paymentSplitterFactory.createPaymentSplitter(payees, shares);
        const paymentSplitterAddress = (await tx.wait()).events[0].args[0];
        paymentSplitter = PaymentSplitter.attach(paymentSplitterAddress);

        expect(Number(await paymentSplitter.totalShares())).to.equal(10000);
        expect(Number(await paymentSplitter.totalReleased())).to.equal(0);
        expect(Number(await paymentSplitter.shares(payees[0]))).to.equal(shares[0]);
        expect(Number(await paymentSplitter.shares(payees[1]))).to.equal(shares[1]);
        expect(Number(await paymentSplitter.shares(payees[2]))).to.equal(shares[2]);
        expect(Number(await paymentSplitter.released(payees[0]))).to.equal(0);
        expect(Number(await paymentSplitter.released(payees[1]))).to.equal(0);
        expect(Number(await paymentSplitter.released(payees[2]))).to.equal(0);
    });

    it("Should split amounts received", async () => {
        const tx = await transferHelper.to(paymentSplitter.address, { value: amountSent });
        receipt = await tx.wait();

        const iniOwnerBalance = await owner.getBalance();
        await paymentSplitter.connect(bob).release(ownerAddress);
        const endOwnerBalance = await owner.getBalance();

        const expectedOwnerShare = Number(amountSent) * (shares[0] / 10000);
        expect(Number(endOwnerBalance.sub(iniOwnerBalance))).to.equal(expectedOwnerShare);
        expect(Number(await paymentSplitter.released(ownerAddress))).to.equal(expectedOwnerShare);
        expect(Number(await provider.getBalance(paymentSplitter.address))).to.equal(
            amountSent - expectedOwnerShare
        );

        const iniBobBalance = await bob.getBalance();
        await paymentSplitter.connect(owner).release(bobAddress);
        const endBobBalance = await bob.getBalance();

        const expectedBobShare = Number(amountSent) * (shares[1] / 10000);
        expect(Number(endBobBalance.sub(iniBobBalance))).to.equal(expectedBobShare);
        expect(Number(await paymentSplitter.released(bobAddress))).to.equal(expectedBobShare);
        expect(Number(await provider.getBalance(paymentSplitter.address))).to.equal(
            amountSent - expectedOwnerShare - expectedBobShare
        );
    });
});

getSignerAndAddress = async (name) => {
    const signer = await reef.getSignerByName(name);
    if (!(await signer.isClaimed())) {
        console.log(`\tClaiming default account for ${name}...`);
        await signer.claimDefaultAccount();
    }
    const address = await signer.getAddress();

    return [signer, address];
};

toReef = (value) => {
    return ethers.utils.parseUnits(value.toString(), "ether");
};

revertedWith = async (promise, message) => {
    try {
        await promise;
        console.log("Promise was expected to throw error but did not.");
        assert(false);
    } catch (error) {
        expect(error.message).contains(message);
    }
};

logBalance = async (signer, name) => {
    const balance = Number(await signer.getBalance()) / 1e18;
    console.log(`Balance of ${name}: ${balance}`);
};
