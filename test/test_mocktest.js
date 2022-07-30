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

    const MutableContract = await ethers.getContractFactory("Unsealable");
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
    it("Should be able to mint and request a refund", async function () {
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        const balanceAfterMint = await MutableContractInstance.balanceOf(account2.address);
        expect(balanceAfterMint).to.eq(1);

        const endRefundTime = await MutableContractInstance.getRefundGuaranteeEndTime();
        await simulateNextBlockTime(endRefundTime, -10);

        await MutableContractInstance.connect(account2).refund([0]);

        const balanceAfterRefund = await MutableContractInstance.balanceOf(account2.address);
        expect(balanceAfterRefund).to.eq(0);

        const balanceAfterRefundOfOwner = await MutableContractInstance.balanceOf(
            owner.address
        );
        expect(balanceAfterRefundOfOwner).to.eq(1);
    });
    it("Should be sealed at mint", async function () {
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        const balanceAfterMint = await MutableContractInstance.balanceOf(account2.address);
        expect(balanceAfterMint).to.eq(1);
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(0);
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

    it(`Should refundPeriod ${REFUND_PERIOD}`, async function () {
        expect(await MutableContractInstance.REFUND_PERIOD()).to.be.equal(REFUND_PERIOD);
    });

    it(`Should maxUserMintAmount ${MAX_MINT_PER_TRANSACTION}`, async function () {
        expect(await MutableContractInstance.MAX_MINT_PER_TRANSACTION()).to.be.equal(
            MAX_MINT_PER_TRANSACTION
        );
    });

    it("Should refundEndTime is same with block timestamp in first deploy", async function () {
        const refundEndTime = await MutableContractInstance.getRefundGuaranteeEndTime();
        expect(blockDeployTimeStamp + REFUND_PERIOD).to.be.equal(refundEndTime);
    });

    it(`Should refundGuaranteeActive = true`, async function () {
        expect(await MutableContractInstance.isRefundGuaranteeActive()).to.be.true;
    });
});

describe("Owner", function () {
    it("Should be able to mint", async function () {
        await MutableContractInstance.ownerMint(1);
        expect(await MutableContractInstance.balanceOf(owner.address)).to.be.equal(1);
        expect(await MutableContractInstance.ownerOf(0)).to.be.equal(owner.address);
    });

    it('should not allow owner to mint more than allotted', async function () {
        await expect(MutableContractInstance.ownerMint(MAX_OWNER_MINT + 1)).to.be.revertedWith("Exceeds maximum owner mint amount");
        await expect(MutableContractInstance.ownerGiftMint(account2.address, MAX_OWNER_MINT+1)).to.be.revertedWith(
            "Exceeds maximum owner mint amount");
        await MutableContractInstance.ownerMint(MAX_OWNER_MINT);
        await expect(MutableContractInstance.ownerMint(1)).to.be.revertedWith("Exceeds maximum owner mint amount");
        await expect(MutableContractInstance.ownerGiftMint(account2.address, 1)).to.be.revertedWith(
            "Exceeds maximum owner mint amount");
    });
    it('should not allow owner to mint more than allotted after gifting', async function () {
        await expect(MutableContractInstance.ownerMint(MAX_OWNER_MINT + 1)).to.be.revertedWith("Exceeds maximum owner mint amount");
        await expect(MutableContractInstance.ownerGiftMint(account2.address, MAX_OWNER_MINT+1)).to.be.revertedWith(
            "Exceeds maximum owner mint amount");
        await MutableContractInstance.ownerGiftMint(account2.address, MAX_OWNER_MINT);
        await expect(MutableContractInstance.ownerMint(1)).to.be.revertedWith("Exceeds maximum owner mint amount");
        await expect(MutableContractInstance.ownerGiftMint(account2.address, 1)).to.be.revertedWith(
            "Exceeds maximum owner mint amount");
    });

    it("Should not be able to mint when `Max mint supply reached`", async function () {
        await MutableContractInstance.provider.send("hardhat_setStorageAt", [
            MutableContractInstance.address,
            "0x0",
            ethers.utils.solidityPack(["uint256"], [MAX_MINT_SUPPLY]), // 8000
        ]);
        await expect(MutableContractInstance.ownerMint(1)).to.be.revertedWith(
            "Max mint supply reached"
        );
    });

    it("Should not be withdraw when `Refund period not over`", async function () {
        await expect(MutableContractInstance.connect(owner).withdraw()).to.revertedWith(
            "Refund period not over"
        );
    });

    it("Should be withdraw after refundEndTime", async function () {
        const refundEndTime = await MutableContractInstance.getRefundGuaranteeEndTime();

        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        await simulateNextBlockTime(refundEndTime, +11);

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
                .publicSaleMint(1, {value: parseEther(MINT_PRICE)})
        ).to.be.revertedWith("Public sale is not active");
    });

    it("Should not be able to mint when `Wrong amount of eth sent`", async function () {
        await expect(
            MutableContractInstance.connect(account2).publicSaleMint(1, {value: 0})
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
                .publicSaleMint(1, {value: parseEther(MINT_PRICE)})
        ).to.be.revertedWith("Max mint supply reached");
    });

    it("Should not be able to mint when `Over mint limit`", async function () {
        await expect(
            MutableContractInstance
                .connect(account2)
                .publicSaleMint(MAX_MINT_PER_TRANSACTION + 1, {value: parseEther(MINT_PRICE)})
        ).to.be.revertedWith("Over mint limit");
    });
});

describe('Partner Mint', function () {
    it('should give the proper price if you hold a partner pass', async function () {
        await setupPartnerContract();
        const partnerTokenBalance = await PartnerContractInstance.balanceOf(account3.address);
        expect(partnerTokenBalance).to.be.eq(1);
        let contracts = await MutableContractInstance.connect(owner).getPartnerContracts();
        expect(contracts.length).to.be.eq(0);
        let isEligible = await MutableContractInstance.connect(owner).isEligiblePartnerMint(account3.address);
        expect(isEligible).to.be.false;
        await MutableContractInstance.setPartners([PartnerContractInstance.address]);
        contracts = await MutableContractInstance.connect(owner).getPartnerContracts();
        expect(contracts.length).to.be.eq(1);
        isEligible = await MutableContractInstance.connect(owner).isEligiblePartnerMint(account3.address);
        expect(isEligible).to.be.true;
        await expect(MutableContractInstance
            .connect(account3)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)})).to.be.revertedWith('Wrong amount of eth sent');
        await MutableContractInstance
            .connect(account3)
            .publicSaleMint(1, {value: parseEther(PARTNER_MINT_PRICE)});
        const balanceAfterMint = await MutableContractInstance.balanceOf(account3.address);
        expect(balanceAfterMint).to.eq(1);

        const endRefundTime = await MutableContractInstance.getRefundGuaranteeEndTime();
        await simulateNextBlockTime(endRefundTime, -10);

        const ethBalanceBeforeRefund = await MutableContractInstance.provider.getBalance(account3.address);
        await MutableContractInstance.connect(account3).refund([0]);
        const ethBalanceAfterRefund = await account3.getBalance();
        expect(ethBalanceAfterRefund).to.be.gt(ethBalanceBeforeRefund);

        const balanceAfterRefund = await MutableContractInstance.balanceOf(account3.address);
        expect(balanceAfterRefund).to.eq(0);

        const balanceAfterRefundOfOwner = await MutableContractInstance.balanceOf(
            owner.address
        );
        expect(balanceAfterRefundOfOwner).to.eq(1);
    });
    it('should allow partners to be added and removed', async function () {
        await setupPartnerContract()
        let contracts = await MutableContractInstance.connect(owner).getPartnerContracts();
        expect(contracts.length).to.be.eq(0);
        await MutableContractInstance.setPartners([PartnerContractInstance.address]);
        contracts = await MutableContractInstance.connect(owner).getPartnerContracts();
        expect(contracts.length).to.be.eq(1);
        expect(contracts).to.include(PartnerContractInstance.address);
        await MutableContractInstance.setPartners([]);
        contracts = await MutableContractInstance.connect(owner).getPartnerContracts();
        expect(contracts).not.to.include(PartnerContractInstance.address);
    });
});

describe("Seal/Unseal/Reseal", function () {
    // TODO Add URI tests
    it("Should not be unsealable at first", async function () {
        expect(await MutableContractInstance.connect(account2).canUnseal()).to.be.false;
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        const balanceAfterMint = await MutableContractInstance.balanceOf(account2.address);
        expect(balanceAfterMint).to.eq(1);
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(0);
        await expect(MutableContractInstance
            .connect(account2)
            .unseal([0])).to.be.revertedWith("Unseal not enabled");
    });
    it("Should be usealable after enabling", async function () {
        await MutableContractInstance.toggleCanUnseal();
        expect(await MutableContractInstance.connect(account2).canUnseal()).to.be.true;
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        const balanceAfterMint = await MutableContractInstance.balanceOf(account2.address);
        expect(balanceAfterMint).to.eq(1);
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(0);
        await MutableContractInstance
            .connect(account2)
            .unseal([0]);
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(1);
    });
    it("Cannot unseal an unsealed token", async function () {
        await MutableContractInstance.toggleCanUnseal();
        expect(await MutableContractInstance.connect(account2).canUnseal()).to.be.true;
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        const balanceAfterMint = await MutableContractInstance.balanceOf(account2.address);
        expect(balanceAfterMint).to.eq(1);
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(0);
        await MutableContractInstance
            .connect(account2)
            .unseal([0]);
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(1);
        await expect(MutableContractInstance
            .connect(account2)
            .unseal([0])).to.be.revertedWith("Token is already Unsealed");
    });
    it("Should not be resealable when disabled", async function () {
        await MutableContractInstance.toggleCanUnseal();
        expect(await MutableContractInstance.connect(account2).canUnseal()).to.be.true;
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        const balanceAfterMint = await MutableContractInstance.balanceOf(account2.address);
        expect(balanceAfterMint).to.eq(1);
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(0);
        await MutableContractInstance
            .connect(account2)
            .unseal([0]);
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(1);
        expect(await MutableContractInstance.connect(account2).canReseal()).to.be.false;
        await expect(MutableContractInstance
            .connect(account2)
            .reseal([0])).to.be.revertedWith("Reseal not enabled");
    });
    it("Should be resealable when enabled", async function () {
        await MutableContractInstance.toggleCanUnseal();
        expect(await MutableContractInstance.connect(account2).canUnseal()).to.be.true;
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        const balanceAfterMint = await MutableContractInstance.balanceOf(account2.address);
        expect(balanceAfterMint).to.eq(1);
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(0);
        await MutableContractInstance
            .connect(account2)
            .unseal([0]);
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(1);
        expect(await MutableContractInstance.connect(account2).canReseal()).to.be.false;
        await MutableContractInstance.toggleCanReseal();
        expect(await MutableContractInstance.connect(account2).canReseal()).to.be.true;
        await expect(MutableContractInstance
            .connect(account2)
            .reseal([0])).to.be.revertedWith("Wrong amount of eth sent");
        await MutableContractInstance
            .connect(account2)
            .reseal([0], {value: parseEther(RESEAL_PRICE)});
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(2);
    });
    it("Multiple should be unsealable", async function () {
        await MutableContractInstance.toggleCanUnseal();
        expect(await MutableContractInstance.connect(account2).canUnseal()).to.be.true;
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(2, {value: parseEther((2 * Number(MINT_PRICE)).toString())});

        await MutableContractInstance.connect(account2).unseal([0, 1]);
        let sealStatus0 = await MutableContractInstance.sealStatus(0);
        let sealStatus1 = await MutableContractInstance.sealStatus(1);
        expect(sealStatus0).to.eq(1);
        expect(sealStatus1).to.eq(1);
    });
    it("Multiple should be resealable if right payable sent", async function () {
        await MutableContractInstance.toggleCanUnseal();
        expect(await MutableContractInstance.connect(account2).canUnseal()).to.be.true;
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(2, {value: parseEther((2 * Number(MINT_PRICE)).toString())});

        await MutableContractInstance.connect(account2).unseal([0, 1]);
        let sealStatus0 = await MutableContractInstance.sealStatus(0);
        let sealStatus1 = await MutableContractInstance.sealStatus(1);
        expect(sealStatus0).to.eq(1);
        expect(sealStatus1).to.eq(1);
        await MutableContractInstance.toggleCanReseal();
        await expect(MutableContractInstance
            .connect(account2)
            .reseal([0, 1])).to.be.revertedWith("Wrong amount of eth sent");
        await MutableContractInstance
            .connect(account2)
            .reseal([0, 1], {value: parseEther((2 * Number(RESEAL_PRICE)).toString())});
        sealStatus0 = await MutableContractInstance.sealStatus(0);
        sealStatus1 = await MutableContractInstance.sealStatus(1);
        expect(sealStatus0).to.eq(2);
        expect(sealStatus1).to.eq(2);
    });
    it("Can't unseal someone elses token", async function () {
        await MutableContractInstance.toggleCanUnseal();
        expect(await MutableContractInstance.connect(account2).canUnseal()).to.be.true;
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        const balanceAfterMint = await MutableContractInstance.balanceOf(account2.address);
        expect(balanceAfterMint).to.eq(1);
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(0);
        await expect(MutableContractInstance
            .connect(account3)
            .unseal([0])).to.be.revertedWith("Not token owner");
    });
    it("Can't unseal non-existent token", async function () {
        await MutableContractInstance.toggleCanUnseal();
        expect(await MutableContractInstance.connect(account2).canUnseal()).to.be.true;
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        const balanceAfterMint = await MutableContractInstance.balanceOf(account2.address);
        expect(balanceAfterMint).to.eq(1);
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(0);
        await expect(MutableContractInstance
            .connect(account2)
            .unseal([2])).to.be.revertedWith("URIQueryForNonexistentToken()");
    });
    it("Reverts on several mixed/bad conditions", async function () {
        await MutableContractInstance.toggleCanUnseal();
        expect(await MutableContractInstance.connect(account2).canUnseal()).to.be.true;
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(2, {value: parseEther((2 * Number(MINT_PRICE)).toString())});
        await MutableContractInstance.connect(account2).unseal([0])
        await MutableContractInstance
            .connect(account3)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});
        const conditions = [
            [1, 2], // one that should and one owned by another
            [2, 1], // one that should and one owned by another
            [0, 1], // on sealed and one unsealed
            [1, 0], // on sealed and one unsealed
            [1, 5], // on unsealed and one non-existent
            [5, 1], // on unsealed and one non-existent
        ]
        for (condition in conditions) {
            await expect(MutableContractInstance
                .connect(account2)
                .unseal(condition)).to.be.reverted;
        }
    });
    it("Should be able to change reseal price", async function () {
        await MutableContractInstance.toggleCanUnseal();
        expect(await MutableContractInstance.connect(account2).canUnseal()).to.be.true;
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        const balanceAfterMint = await MutableContractInstance.balanceOf(account2.address);
        expect(balanceAfterMint).to.eq(1);
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(0);
        await MutableContractInstance
            .connect(account2)
            .unseal([0]);
        await MutableContractInstance.toggleCanReseal();
        expect(await MutableContractInstance.resealPrice()).to.be.eq(parseEther(RESEAL_PRICE));
        await MutableContractInstance.setResealPrice(parseEther("1.0"));
        expect(await MutableContractInstance.resealPrice()).to.be.eq(parseEther("1.0"));
        await expect(MutableContractInstance
            .connect(account2)
            .reseal([0], {value: parseEther(RESEAL_PRICE)})).to.be.revertedWith("Wrong amount of eth sent");
        await MutableContractInstance
            .connect(account2)
            .reseal([0], {value: parseEther("1.0")});
        sealStatus = await MutableContractInstance.sealStatus(0);
        expect(sealStatus).to.eq(2);
    });
});

describe("Refund", function () {
    const priceForFive = (5 * Number(MINT_PRICE)).toString();
    it("Should be store correct tokenId in refund", async function () {
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(5, {value: parseEther(priceForFive)});
        const originBalance = await MutableContractInstance.provider.getBalance(
            account2.address
        );
        await MutableContractInstance.connect(account2).refund([3]);
        expect(await MutableContractInstance.hasRefunded(3)).to.be.true;
        const postBalance = await MutableContractInstance.provider.getBalance(
            account2.address
        );
        expect(Number(ethers.utils.formatEther(originBalance))).to.be.lt(Number(ethers.utils.formatEther(postBalance)));
    });

    it("Should be revert `Freely minted NFTs cannot be refunded`", async function () {
        await MutableContractInstance.ownerMint(1);
        expect(await MutableContractInstance.isOwnerMint(0)).to.be.equal(true);
        await expect(MutableContractInstance.refund([0])).to.be.revertedWith(
            "Freely minted NFTs cannot be refunded"
        );
    });

    it("Gift Mint should be revert `Freely minted NFTs cannot be refunded`", async function () {
        await MutableContractInstance.ownerGiftMint(account2.address, 1);
        expect(await MutableContractInstance.isOwnerMint(0)).to.be.equal(true);
        await expect(MutableContractInstance.refund([0])).to.be.revertedWith("Not token owner")
        await expect(
            MutableContractInstance.connect(account2).refund([0])
        ).to.be.revertedWith("Freely minted NFTs cannot be refunded");
    });

    it("Should be refund NFT in 45 days", async function () {
        const refundEndTime = await MutableContractInstance.getRefundGuaranteeEndTime();

        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        await MutableContractInstance.provider.send("evm_setNextBlockTimestamp", [
            refundEndTime.toNumber(),
        ]);

        await MutableContractInstance.connect(account2).refund([0]);
    });

    it("Should not be refunded when `Not token owner`", async function () {
        await MutableContractInstance.ownerMint(1);
        expect(await MutableContractInstance.isOwnerMint(0)).to.be.equal(true);
        await expect(
            MutableContractInstance.connect(account2).refund([0])
        ).to.be.revertedWith("Not token owner");
    });

    it("Mixed mint should be revert `Freely minted NFTs cannot be refunded`", async function () {
        await MutableContractInstance.ownerGiftMint(account2.address, 1);
        expect(await MutableContractInstance.isOwnerMint(0)).to.be.equal(true);
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});
        await expect(MutableContractInstance.refund([0, 1])).to.be.revertedWith("Not token owner")
        await expect(MutableContractInstance.refund([1, 0])).to.be.revertedWith("Not token owner")
        await expect(
            MutableContractInstance.connect(account2).refund([0, 1])
        ).to.be.revertedWith("Freely minted NFTs cannot be refunded");
        await expect(
            MutableContractInstance.connect(account2).refund([1, 0])
        ).to.be.revertedWith("Freely minted NFTs cannot be refunded");
    });

    it("Should not be refunded NFT twice `Already refunded`", async function () {
        // update refund address and mint NFT from refund address
        await MutableContractInstance.setRefundAddress(account3.address);
        let isEligible = await MutableContractInstance.connect(owner).isEligiblePartnerMint(account3.address);
        expect(isEligible).to.be.false;
        await MutableContractInstance
            .connect(account3)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        // other user mint 3 NFTs
        const priceForThree = (3 * Number(MINT_PRICE)).toString();
        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(3, {value: parseEther(priceForThree)});
        const balanceAfterFour = (4 * Number(MINT_PRICE)).toString();
        expect(
            await MutableContractInstance.provider.getBalance(MutableContractInstance.address)
        ).to.be.equal(parseEther(balanceAfterFour));

        await MutableContractInstance.connect(account3).refund([0]);
        await expect(
            MutableContractInstance.connect(account3).refund([0])
        ).to.be.revertedWith("Already refunded");
    });

    it("Should not be refund NFT expired after 45 days `Refund expired`", async function () {
        const refundEndTime = await MutableContractInstance.getRefundGuaranteeEndTime();

        await MutableContractInstance
            .connect(account2)
            .publicSaleMint(1, {value: parseEther(MINT_PRICE)});

        await simulateNextBlockTime(refundEndTime, +1);

        await expect(MutableContractInstance.connect(account2).refund([0])).to.revertedWith(
            "Refund expired"
        );
    });
});

describe("Toggle/Restart", function () {
    it("Should be call restartRefundCountdown and refundEndTime add `refundPeriod` days.", async function () {
        const beforeRefundEndTime = (
            await MutableContractInstance.getRefundGuaranteeEndTime()
        ).toNumber();

        await MutableContractInstance.provider.send("evm_setNextBlockTimestamp", [
            beforeRefundEndTime,
        ]);

        await MutableContractInstance.restartRefundCountdown();

        const afterRefundEndTime = (
            await MutableContractInstance.getRefundGuaranteeEndTime()
        ).toNumber();

        expect(afterRefundEndTime).to.be.equal(beforeRefundEndTime + REFUND_PERIOD);
    });

    it("Should be call togglePublicSaleStatus", async function () {
        await MutableContractInstance.togglePublicSaleStatus();
        expect(await MutableContractInstance.publicSaleActive()).to.be.false;
    });
});

describe("Setter", function () {
    it("Should be call setRefundAddress", async function () {
        await MutableContractInstance.setRefundAddress(account2.address);
        expect(await MutableContractInstance.refundAddress()).to.be.equal(account2.address);
    });

});
