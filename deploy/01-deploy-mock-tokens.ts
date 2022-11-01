import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";
import { networkConfig, developmentChains } from "../helper-hardhat-config";

const mockTokens: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  log("Deplying Mock Tokens");

  let args: any = [];

  const batToken = await deploy("Bat", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });

  const zrxToken = await deploy("Zrx", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });

  const repToken = await deploy("Rep", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });

  const daiToken = await deploy("Dai", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });

  log(`Mock Bat deployed at ${batToken.address}`);
  log(`Mock Zrx deployed at ${zrxToken.address}`);
  log(`Mock Rep deployed at ${repToken.address}`);
  log(`Mock Dai deployed at ${daiToken.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
  ) {
    await verify(batToken.address, []);
    await verify(zrxToken.address, []);
    await verify(repToken.address, []);
    await verify(daiToken.address, []);
  }
};

export default mockTokens;
