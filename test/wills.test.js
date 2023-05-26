const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Wills", async function () {
    let accountOne,
      accountTwo,
      accountThree,
      accountFour,
      NFTContract,
      tokenContract,
      WillsContract;
    let uri = "Hello"
    
    //Before EAch is a Hook that ensures that before each of our testats, our specified function will run.
    beforeEach(async function () {
        //If you get the signers inside the describe it'll keep returning "0 passing"
        [accountOne, accountTwo, accountThree, accountFour] =
          await ethers.getSigners();
        const NFTContractFactory = await ethers.getContractFactory(
          "NFTCollection"
        );
        NFTContract = await NFTContractFactory.deploy();
         //Mint two NFTS each to address one and address two
        await NFTContract.connect(accountOne).mint(`${uri}a`);
        await NFTContract.connect(accountOne).mint(`${uri}b`);
        await NFTContract.connect(accountTwo).mint(`${uri}c`);
        await NFTContract.connect(accountTwo).mint(`${uri}d`);

        //deploying the Token contract
        const tokenContractFactory = await ethers.getContractFactory("WWTBAC");
        tokenContract = await tokenContractFactory.deploy();
        //Minting tokens to Adrress two
        await tokenContract.connect(accountTwo).mint(1000);

        //Deploy Wills Contract
        const WillsContractFactory = await ethers.getContractFactory("Will");
        WillsContract = await WillsContractFactory.deploy();
    });
    //This is where our main test starts from
    describe("NFT Deployer", function() {
        //The It is where you write you indivdual tests
        it("Should return the owner of an NFT as well as the owners balance", async function() {
            expect(await NFTContract.tokenCount()).to.equal(4);
            expect(await NFTContract.ownerOf(1)).to.equal(accountOne.address);
            expect(await NFTContract.ownerOf(2)).to.equal(accountOne.address);
            expect(await NFTContract.ownerOf(3)).to.equal(accountTwo.address);
            expect(await NFTContract.ownerOf(4)).to.equal(accountTwo.address);

            expect(await NFTContract.balanceOf(accountOne.address)).to.equal(2);
            expect(await NFTContract.balanceOf(accountTwo.address)).to.equal(2);
        })
    });

    describe("Token Deployer", function(){
        it("Should return the balance of accountOne and AccountTwo", async function() {
            expect(await tokenContract.balanceOf(accountTwo.address)).to.equal(1000);
        })
    });

    describe("Wills Deployer", function(){
        it("creates and releases an NFT gift", async function() {
            //Creates NFT gift
            let timestamp = await time.latest();
            await NFTContract.connect(accountOne).setApprovalForAll(WillsContract.address, true);
            await WillsContract.connect(accountOne).createNFTGift(
              NFTContract.address,
              accountThree.address,
              1,
              timestamp + 100
            );
            expect(await WillsContract.getGiftLength("NFT", accountOne.address, accountThree.address)).to.equal(1);
            expect(await NFTContract.ownerOf(1)).to.equal(WillsContract.address);

            //Release of NFT gift;
            await time.increase(120);
            await WillsContract.connect(accountThree).releaseNFTGift(
              0,
              accountOne.address
            );
            expect(await NFTContract.ownerOf(1)).to.equal(accountThree.address);
        })

        it("Creates and releases an ERC20 gift", async function() {
            //Creation of ERC20 Gift
            let giftAmount = 200;
            let timestamp = await time.latest();
            await tokenContract.connect(accountOne).approve(WillsContract.address, giftAmount);
            await WillsContract.connect(accountOne).createFungibleTokenGift(
              tokenContract.address,
              accountThree.address,
              giftAmount,
              timestamp + 100
            );
            expect(await WillsContract.getGiftLength("ERC20", accountOne.address, accountThree.address)).to.equal(1);
            expect(await tokenContract.balanceOf(WillsContract.address)).to.equal(giftAmount);

            //Release of ERC20 Gift
            await time.increase(120);
            await WillsContract.connect(accountThree).releaseFungibleTokenGift(
              0, 
              accountOne.address
            );
            expect(await tokenContract.balanceOf(accountThree.address)).to.equal(giftAmount);
        });
        

        it("Creates and Releases Ether Gifts", async function(){
            //Create Ether Gift;
            let contractBalance;
            let amount = "0.2";
            let weiAmount = ethers.utils.parseEther(amount);
            let timestamp = await time.latest();
            await WillsContract.connect(accountTwo).createEtherGift(
              accountFour.address,
              weiAmount,
              timestamp + 100,
              { value: weiAmount }
            );
            contractBalance = await WillsContract.provider.getBalance(WillsContract.address);
            expect(contractBalance).to.equal(weiAmount);

            // Release of Ether Gift
            await time.increase(120);
            await WillsContract.connect(accountFour).releaseEther(0, accountTwo.address);
            contractBalance = await WillsContract.provider.getBalance(WillsContract.address);
            expect(contractBalance).to.equal("0");
        })
    });

    describe("Handles Fail cases", function() {
        it("Should revert if anyone but Beneficiary calls the release", async function() {
            let timestamp = await time.latest();
            await NFTContract.connect(accountOne).setApprovalForAll(
              WillsContract.address,
              true
            );
            await WillsContract.connect(accountOne).createNFTGift(
              NFTContract.address,
              accountThree.address,
              1,
              timestamp + 100
            );
            
            //Release Fail and Revert
            await time.increase(120);
            await expect(
              WillsContract.connect(accountFour).releaseNFTGift(
                0,
                accountOne.address
              )
            ).to.be.revertedWithCustomError(
              WillsContract, `WillsNotBeneficiaryError`
            );
        })

        it("Should revert if the release Date is not Due", async function() {
            let timestamp = await time.latest();
            await NFTContract.connect(accountOne).setApprovalForAll(
              WillsContract.address,
              true
            );
            await WillsContract.connect(accountOne).createNFTGift(
              NFTContract.address,
              accountThree.address,
              1,
              timestamp + 100
            );
            
            //Release Fail and Revert
            await expect(
              WillsContract.connect(accountThree).releaseNFTGift(
                0,
                accountOne.address
              )
            ).to.be.revertedWithCustomError(
              WillsContract,
              `WillsGiftNotDueError`
            );
        })

        it("Should revert if release date is not in the future", async function() {
            let timestamp = await time.latest();
            await NFTContract.connect(accountOne).setApprovalForAll(
              WillsContract.address,
              true
            );

            await expect(
              WillsContract.connect(accountOne).createNFTGift(
                NFTContract.address,
                accountThree.address,
                1,
                timestamp
              )
            ).to.be.revertedWithCustomError(
              WillsContract,
              "WillsInvalidReleaseDateError"
            );
        });

        it("Fails if you try to claim an already released gift", async function () {
          //Creation of ERC20 Gift
          let giftAmount = 200;
          let timestamp = await time.latest();
          await tokenContract
            .connect(accountOne)
            .approve(WillsContract.address, giftAmount);
          await WillsContract.connect(accountOne).createFungibleTokenGift(
            tokenContract.address,
            accountThree.address,
            giftAmount,
            timestamp + 100
          );

          await time.increase(120);
          await WillsContract.connect(accountThree).releaseFungibleTokenGift(
            0,
            accountOne.address
          );
        
          await expect(
            WillsContract.connect(accountThree).releaseFungibleTokenGift(
              0,
              accountOne.address
            )
          ).to.be.revertedWithCustomError(
            WillsContract,
            "WillsGiftAlreadyReleasedError"
          );
        });
    });

    describe("Handles cancellation of Gift", function(){
        it("Should revert if you try to cancel an already claimed gift", async function(){
            let amount = "0.4";
            let weiAmount = ethers.utils.parseEther(amount);
            let timestamp = await time.latest();
            await WillsContract.connect(accountTwo).createEtherGift(
              accountFour.address,
              weiAmount,
              timestamp + 100,
              { value: weiAmount }
            );

            await time.increase(120);
            await WillsContract.connect(accountFour).releaseEther(
                0,
                accountTwo.address
            );
            await expect(
                WillsContract.connect(accountTwo).cancelEtherGift(0, accountFour.address)
            ).to.be.revertedWithCustomError(
              WillsContract,
              "WillsGiftAlreadyReleasedError"
            );
        })

        it("Should update the token balance of testator after gift cancellation", async function() {
            let giftAmount = 200;
            let timestamp = await time.latest();
            await tokenContract.connect(accountTwo).approve(WillsContract.address, giftAmount);
            await WillsContract.connect(accountTwo).createFungibleTokenGift(
                tokenContract.address,
                accountFour.address,
                giftAmount,
                timestamp + 100
            );
            expect(await tokenContract.balanceOf(accountTwo.address)).to.equal("800");
            
            await WillsContract.connect(accountTwo).cancelFungibleTokenGift(0, accountFour.address);
            expect(await tokenContract.balanceOf(accountTwo.address)).to.equal("1000");
        })

        it("Should update the NFT balance of testator after gift cancellation", async function() {
            let timestamp = await time.latest();
            await NFTContract.connect(accountTwo).setApprovalForAll(WillsContract.address, true);
            await WillsContract.connect(accountTwo).createNFTGift(
              NFTContract.address,
              accountFour.address,
              3,
              timestamp + 100
            );
            expect(await NFTContract.ownerOf(3)).to.equal(WillsContract.address);
            
            await WillsContract.connect(accountTwo).cancelNFTGift(0, accountFour.address);
            expect(await NFTContract.ownerOf(3)).to.equal(accountTwo.address);
        })
    })
})