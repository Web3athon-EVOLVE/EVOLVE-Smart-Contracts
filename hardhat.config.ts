import "dotenv/config";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-abi-exporter";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

// This is a simple Hardhat task that prints "Hello, World" to your console 
// If it turns correctly then your config file has no syntax errors
task("hello", "Prints 'Hello, World!'", async () => {
  console.log("Hello, World!");
});

// Make sure you setup .env file if there's errors
const { MUMBAI_ALCHEMY_KEY, 
        MUMBAI_ALCHEMY_API_URL, 
        PRIVATE_KEY, 
        POLYGONSCAN_API_KEY,
        ADMIN_WALLET_SEED
      } = process.env;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.12",
      },
      {
        version: "0.4.24",
      },
      {
        version: "0.6.7",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: MUMBAI_ALCHEMY_API_URL,
      accounts: {
        mnemonic: ADMIN_WALLET_SEED,
      },
      // accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      gas: 2100000,
      gasPrice: 8000000000
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  // abiExporter: {
  //   path: "./ABIs",
  //   runOnCompile: true,
  //   clear: true,
  //   flat: true,
  //   only: [],
  //   spacing: 2,
  //   pretty: false,
  // },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  }
};

export default config;