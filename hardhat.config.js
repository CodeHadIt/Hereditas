require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-etherscan");

const ALCHEMY_GOERLI_API_KEY_URL =
  process.env.ALCHEMY_GOERLI_API_KEY_URL || "https://eth-goerli/example.com";
const ALCHEMY_SEPOLIA_API_KEY_URL =
  process.env.ALCHEMY_SEPOLIA_API_KEY_URL || "https://eth-sepolia/example.com";
const ACCOUNT_ONE_PRIVATE_KEY = process.env.ACCOUNT_ONE_PRIVATE_KEY;
const ACCOUNT_TWO_PRIVATE_KEY = process.env.ACCOUNT_TWO_PRIVATE_KEY;

const ETHER_SCAN_API_KEY = process.env.ETHER_SCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    sepolia: {
      url: ALCHEMY_SEPOLIA_API_KEY_URL,
      accounts: [ACCOUNT_ONE_PRIVATE_KEY, ACCOUNT_TWO_PRIVATE_KEY],
      chainId: 11155111,
    },
    goerli: {
      url: ALCHEMY_GOERLI_API_KEY_URL,
      accounts: [ACCOUNT_ONE_PRIVATE_KEY, ACCOUNT_TWO_PRIVATE_KEY],
      chainId: 5,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHER_SCAN_API_KEY,
  },
};
