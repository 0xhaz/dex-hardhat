import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
// @ts-ignore
import { ethers, artifacts } from "hardhat";
import verify from "../utils/verify";
import fs from "fs";
import {
  developmentChains,
  networkConfig,
  feePercent,
} from "../helper-hardhat-config";
import { Exchange } from "../typechain-types";

type Contract = Exchange;

const contractName = "Exchange";

const deployExchange: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer, feeAccount } = await getNamedAccounts();
  const chainId = network.config.chainId;

  log("Deploying Exchange Contract...");
  const exchangeContract = await deploy("Exchange", {
    from: deployer,
    args: [feeAccount, feePercent],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });

  saveFrontEndFiles(exchangeContract, contractName);
  saveConfig(exchangeContract, contractName);

  log(`Exchange deployed at ${exchangeContract.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
  ) {
    await verify(exchangeContract.address, []);
  }
};

function saveFrontEndFiles(contract: Contract, contractName: string) {
  const contractDir = __dirname + "/../pages/contracts";

  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir);
  }

  fs.writeFileSync(
    contractDir + "/contract-address.json",
    JSON.stringify({ [contractName]: contract.address }, undefined, 2)
  );

  const Artifact = artifacts.readArtifactSync(contractName);

  fs.writeFileSync(
    contractDir + `/${contractName}.json`,
    JSON.stringify(Artifact, null, 2)
  );
}

function saveConfig(contract: Contract, contractName: string) {
  fs.writeFileSync(
    "./config.json",
    JSON.stringify({ [contractName]: contract.address }, undefined, 2)
  );
}

export default deployExchange;
