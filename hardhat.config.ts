import "dotenv/config";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-chai-matchers";
import { HardhatUserConfig, task } from "hardhat/config";

const GOERLI_URL = process.env.NEXT_PUBLIC_GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
      saveDeployments: true,
      // gas: 2100000,
      gasPrice: 8000000000,
    },
    localhost: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
      saveDeployments: true,
      gasPrice: 8000000000,
    },
    goerli: {
      url: GOERLI_URL,
      accounts: [`${PRIVATE_KEY}`],
      chainId: 5,
      allowUnlimitedContractSize: true,
    },
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "ETH",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
    trader1: {
      default: 2,
    },
    trader2: {
      default: 3,
    },
    trader3: {
      default: 4,
    },
    trader4: {
      default: 5,
    },
  },
};

export default config;
