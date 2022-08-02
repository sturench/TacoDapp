const {expect} = require("chai");
const {BigNumber} = require("ethers");
const {ethers} = require("hardhat");

const parseEther = ethers.utils.parseEther;

let owner;
let account2;
let account3;
let MutableContractInstance;
let PartnerContractInstance;

let blockDeployTimeStamp;


const MINT_PRICE = "0.0";
const MAX_MINT_SUPPLY = 4005;
const MAX_OWNER_MINT = 100;
const MAX_USER_MINT_AMOUNT = 1;
const MAX_MINT_PER_TRANSACTION = 1;

const mineSingleBlock = async () => {
    await ethers.provider.send("hardhat_mine", [
        ethers.utils.hexValue(1).toString(),
    ]);
};

async function simulateNextBlockTime(baseTime, changeBy) {
    const bi = BigNumber.from(baseTime);
    await ethers.provider.send("evm_setNextBlockTimestamp", [
        ethers.utils.hexlify(bi.add(changeBy)),
    ]);
    await mineSingleBlock();
}

beforeEach(async function () {
    [owner, account2, account3] = await ethers.getSigners();

    const MutableContract = await ethers.getContractFactory("MockoTaco");
    MutableContractInstance = await MutableContract.deploy();
    await MutableContractInstance.deployed();
    blockDeployTimeStamp = (await MutableContractInstance.provider.getBlock("latest"))
        .timestamp;

    await MutableContractInstance.provider.send("hardhat_setBalance", [
        owner.address,
        // parseEther("1.0").toHexString(),
        "0xde0b6b3a7640000", // 1.0 ether
    ]);

    const saleActive = await MutableContractInstance.publicSaleActive();
    expect(saleActive).to.be.equal(false);
    await MutableContractInstance.togglePublicSaleStatus();
    const publicSaleActive = await MutableContractInstance.publicSaleActive();
    expect(publicSaleActive).to.eq(true);
});

describe("Aggregation", function () {
    it("Should be able to public mint", async function () {
        await MutableContractInstance
            .connect(account2)
            .mintPublicTaco(1, {value: parseEther(MINT_PRICE)});

        const balanceAfterMint = await MutableContractInstance.balanceOf(account2.address);
        expect(balanceAfterMint).to.eq(1);
    });
});

describe("Check MutableContract Constant & Variables", function () {
    it(`Should maxMintSupply = ${MAX_MINT_SUPPLY}`, async function () {
        expect(await MutableContractInstance.MAX_MINT_SUPPLY()).to.be.equal(MAX_MINT_SUPPLY);
    });

    it(`Should mintPrice = ${MINT_PRICE}`, async function () {
        expect(await MutableContractInstance.mintPrice()).to.be.equal(
            parseEther(MINT_PRICE)
        );
    });

    it(`Should maxUserMintAmount ${MAX_MINT_PER_TRANSACTION}`, async function () {
        expect(await MutableContractInstance.MAX_MINT_PER_TRANSACTION()).to.be.equal(
            MAX_MINT_PER_TRANSACTION
        );
    });
});

describe("Owner", function () {
    it("Should be able to mint", async function () {
        await MutableContractInstance.mintOwnerTaco(1);
        expect(await MutableContractInstance.balanceOf(owner.address)).to.be.equal(1);
        expect(await MutableContractInstance.ownerOf(0)).to.be.equal(owner.address);
    });

    it('should not allow owner to mint more than allotted', async function () {
        await expect(MutableContractInstance.mintOwnerTaco(MAX_OWNER_MINT + 1)).to.be.revertedWith("Exceeds maximum owner mint amount");
        await expect(MutableContractInstance.giftTaco(account2.address, MAX_OWNER_MINT+1)).to.be.revertedWith(
            "Exceeds maximum owner mint amount");
        await MutableContractInstance.mintOwnerTaco(MAX_OWNER_MINT);
        await expect(MutableContractInstance.mintOwnerTaco(1)).to.be.revertedWith("Exceeds maximum owner mint amount");
        await expect(MutableContractInstance.giftTaco(account2.address, 1)).to.be.revertedWith(
            "Exceeds maximum owner mint amount");
    });
    it('should not allow owner to mint more than allotted after gifting', async function () {
        await expect(MutableContractInstance.mintOwnerTaco(MAX_OWNER_MINT + 1)).to.be.revertedWith("Exceeds maximum owner mint amount");
        await expect(MutableContractInstance.giftTaco(account2.address, MAX_OWNER_MINT+1)).to.be.revertedWith(
            "Exceeds maximum owner mint amount");
        await MutableContractInstance.giftTaco(account2.address, MAX_OWNER_MINT);
        await expect(MutableContractInstance.mintOwnerTaco(1)).to.be.revertedWith("Exceeds maximum owner mint amount");
        await expect(MutableContractInstance.giftTaco(account2.address, 1)).to.be.revertedWith(
            "Exceeds maximum owner mint amount");
    });

    it("Should not be able to mint when `Max mint supply reached`", async function () {
        await MutableContractInstance.provider.send("hardhat_setStorageAt", [
            MutableContractInstance.address,
            "0x0",
            ethers.utils.solidityPack(["uint256"], [MAX_MINT_SUPPLY]), // 8000
        ]);
        await expect(MutableContractInstance.mintOwnerTaco(1)).to.be.revertedWith(
            "Max mint supply reached"
        );
    });

    it("Should be able to withdraw", async function () {
        const NEW_MINT_PRICE = 0.01
        await MutableContractInstance.connect(owner).setMintPrice(parseEther(NEW_MINT_PRICE.toString()))
        await MutableContractInstance
            .connect(account2)
            .mintPublicTaco(1, {value: parseEther(NEW_MINT_PRICE.toString())});

        await MutableContractInstance.provider.send("hardhat_setBalance", [
            owner.address,
            "0x8e1bc9bf040000", // 0.04 ether
        ]);
        const ownerOriginBalance = await MutableContractInstance.provider.getBalance(
            owner.address
        );
        // first check the owner balance is less than 0.1 ether
        expect(ownerOriginBalance).to.be.eq(parseEther("0.04"));

        await MutableContractInstance.connect(owner).withdraw();

        const contractVault = await MutableContractInstance.provider.getBalance(
            MutableContractInstance.address
        );
        const ownerBalance = await MutableContractInstance.provider.getBalance(
            owner.address
        );

        expect(contractVault).to.be.equal(parseEther("0"));
        // the owner origin balance is less than 0.1 ether
        expect(ownerBalance).to.be.gt(parseEther("0.04"));
    });
});

describe("PublicMint", function () {
    it("Should not be able to mint when `Public sale is not active`", async function () {
        await MutableContractInstance.togglePublicSaleStatus();
        await expect(
            MutableContractInstance
                .connect(account2)
                .mintPublicTaco(1, {value: parseEther(MINT_PRICE)})
        ).to.be.revertedWith("Public sale is not active");
    });

    it("Should not be able to mint when `Wrong amount of eth sent`", async function () {
        await expect(
            MutableContractInstance.connect(account2).mintPublicTaco(1, {value: parseEther(MINT_PRICE + 1)})
        ).to.be.revertedWith("Wrong amount of eth sent");
    });

    it("Should not be able to mint when `Max mint supply reached`", async function () {
        await MutableContractInstance.provider.send("hardhat_setStorageAt", [
            MutableContractInstance.address,
            "0x0",
            ethers.utils.solidityPack(["uint256"], [MAX_MINT_SUPPLY]), // 8000
        ]);
        await expect(
            MutableContractInstance
                .connect(account2)
                .mintPublicTaco(1, {value: parseEther(MINT_PRICE)})
        ).to.be.revertedWith("Max mint supply reached");
    });

    it("Should not be able to mint when `Over mint limit`", async function () {
        await expect(
            MutableContractInstance
                .connect(account2)
                .mintPublicTaco(MAX_MINT_PER_TRANSACTION + 1, {value: parseEther(MINT_PRICE)})
        ).to.be.revertedWith("Over mint limit");
    });
});


describe("Setter", function () {
    // it("Should be call setRefundAddress", async function () {
    //     await MutableContractInstance.setRefundAddress(account2.address);
    //     expect(await MutableContractInstance.refundAddress()).to.be.equal(account2.address);
    // });

});
