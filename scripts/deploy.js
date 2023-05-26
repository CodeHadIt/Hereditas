const {network, ethers} = require("hardhat");
const fetch = require("node-fetch");
const { verify } = require("../src/Utils/verify");

async function main(){

  [accountOne, accountTwo] = await ethers.getSigners();

  const NFTContractFactory = await ethers.getContractFactory(
    "HereditasCollective"
  );
  const NFTContract = await NFTContractFactory.deploy();
  await NFTContract.deployed();
  console.log(`Nft contract deployed to ${NFTContract.address}`);

  const NFTtransaction1 = await NFTContract.connect(accountOne).mint(
    "https://gateway.pinata.cloud/ipfs/QmSjwmwT37ussWYLrpV5SY6rFUHX7hWhrxjrp5x3rFos8f/Blue_Lake.json"
  );
  await NFTtransaction1.wait();
  console.log(`The transaction is ${NFTtransaction1.hash}`);

  const NFTtransaction2 = await NFTContract.connect(accountOne).mint(
    "https://gateway.pinata.cloud/ipfs/QmSjwmwT37ussWYLrpV5SY6rFUHX7hWhrxjrp5x3rFos8f/Calm_Lake.json"
  );
  await NFTtransaction2.wait();
  console.log(`The transaction is ${NFTtransaction1.hash}`);

  const NFTtransaction3 = await NFTContract.connect(accountOne).mint(
    "https://gateway.pinata.cloud/ipfs/QmSjwmwT37ussWYLrpV5SY6rFUHX7hWhrxjrp5x3rFos8f/Castle_Mountains.json"
  );
  await NFTtransaction3.wait();
  console.log(`The transaction is ${NFTtransaction1.hash}`);

  //ACCOUNT TWO MINTS
  const NFTtransaction4 = await NFTContract.connect(accountTwo).mint(
    "https://gateway.pinata.cloud/ipfs/QmSjwmwT37ussWYLrpV5SY6rFUHX7hWhrxjrp5x3rFos8f/Desert_Osasis.json"
  );
  await NFTtransaction4.wait();
  console.log(`The transaction is ${NFTtransaction1.hash}`);

  const NFTtransaction5 = await NFTContract.connect(accountTwo).mint(
    "https://gateway.pinata.cloud/ipfs/QmSjwmwT37ussWYLrpV5SY6rFUHX7hWhrxjrp5x3rFos8f/Mount_Fuji.json"
  );
  await NFTtransaction5.wait();
  console.log(`The transaction is ${NFTtransaction1.hash}`);

  const NFTtransaction6 = await NFTContract.connect(accountTwo).mint(
    "https://gateway.pinata.cloud/ipfs/QmSjwmwT37ussWYLrpV5SY6rFUHX7hWhrxjrp5x3rFos8f/Mountain_River.json"
  );
  await NFTtransaction6.wait();
  console.log(`The transaction is ${NFTtransaction1.hash}`);

  const uri = await NFTContract.tokenURI(1);
  console.log(`token uri is ${uri}`);
  const response = await fetch(uri);
  const metaData = await response.json();
  // console.log(`The metadata is ${metaData} and this is the image ${metaData.image}`);
  console.log(metaData)


  const tokenContractFactory = await ethers.getContractFactory("Token");
  const tokenContract = await tokenContractFactory.deploy();
  await tokenContract.deployed();
  console.log(`Token contract deployed to ${tokenContract.address}`);
  tokenContract.connect(accountTwo).mint(1000);


  const WillsContractFactory = await ethers.getContractFactory("Will");
  const WillsContract = await WillsContractFactory.deploy();
  await WillsContract.deployed();
  console.log(`Wills contract deployed to ${WillsContract.address}`);

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("... waiting for block confirmations to verify nftcontract");
    await NFTContract.deployTransaction.wait(3);
    await verify(NFTContract.address, []);
    console.log("successfully verified NFT contract");

    console.log("Waiting for block confirmations to verify Token contract");
    await tokenContract.deployTransaction.wait(3);
    await verify(tokenContract.address, []);
    console.log("successfully verified Token contract");

    console.log("Waiting for block confirmations to verify Wills contract");
    await WillsContract.deployTransaction.wait(3);
    await verify(WillsContract.address, []);
    console.log("successfully verified Token contract");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});