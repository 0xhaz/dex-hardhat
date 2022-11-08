import { ethers, artifacts, network } from "hardhat";
import fs from "fs";
import { Dai, Bat, Zrx, Rep } from "../typechain-types";
import contractAddress from "../config.json";

type Contract = Dai | Bat | Zrx | Rep;

const [DAI, BAT, ZRX, REP] = ["DAI", "BAT", "ZRX", "REP"].map(s =>
  ethers.utils.formatBytes32String(s)
);
const contractName = "Exchange";
const Status = {
  BUY: 0,
  SELL: 1,
};

const tokens = (n: number) => {
  return ethers.utils.parseEther(n.toString());
};

async function main() {
  const [owner, feeAccount, trader1, trader2, trader3, trader4] =
    await ethers.getSigners();

  const factories = await Promise.all([
    ethers.getContractFactory("Dai"),
    ethers.getContractFactory("Bat"),
    ethers.getContractFactory("Zrx"),
    ethers.getContractFactory("Rep"),
  ]);

  const [dai, bat, zrx, rep] = await Promise.all(
    factories.map(f => f.deploy())
  );

  saveFrontendFiles([dai, bat, zrx, rep], ["Dai", "Bat", "Zrx", "Rep"]);

  const dex = await ethers.getContractAt(
    contractName,
    contractAddress[contractName]
  );

  await Promise.all([
    dex.connect(owner).addToken(DAI, dai.address),
    dex.connect(owner).addToken(BAT, bat.address),
    dex.connect(owner).addToken(ZRX, zrx.address),
    dex.connect(owner).addToken(REP, rep.address),
  ]);

  const amount = tokens(1000);

  //   @ts-ignore
  const seedTokenBalance = async (token, trader) => {
    await token.faucet(trader.address, amount);
    await token.connect(trader).approve(dex.address, amount);
  };

  const depositAmount = tokens(100);

  await Promise.all(
    [dai, bat, zrx, rep].map(token => seedTokenBalance(token, trader1))
  );

  await dex.connect(trader1).depositToken(DAI, depositAmount);
  await dex.connect(trader1).depositToken(BAT, depositAmount);
  await dex.connect(trader1).depositToken(ZRX, depositAmount);
  await dex.connect(trader1).depositToken(REP, depositAmount);

  await Promise.all(
    [dai, bat, zrx, rep].map(token => seedTokenBalance(token, trader2))
  );

  await dex.connect(trader2).depositToken(DAI, depositAmount);
  await dex.connect(trader2).depositToken(BAT, depositAmount);
  await dex.connect(trader2).depositToken(ZRX, depositAmount);
  await dex.connect(trader2).depositToken(REP, depositAmount);

  await Promise.all(
    [dai, bat, zrx, rep].map(token => seedTokenBalance(token, trader3))
  );

  await dex.connect(trader3).depositToken(DAI, depositAmount);
  await dex.connect(trader3).depositToken(BAT, depositAmount);
  await dex.connect(trader3).depositToken(ZRX, depositAmount);
  await dex.connect(trader3).depositToken(REP, depositAmount);

  await Promise.all(
    [dai, bat, zrx, rep].map(token => seedTokenBalance(token, trader4))
  );

  await dex.connect(trader4).depositToken(DAI, depositAmount);
  await dex.connect(trader4).depositToken(BAT, depositAmount);
  await dex.connect(trader4).depositToken(ZRX, depositAmount);
  await dex.connect(trader4).depositToken(REP, depositAmount);

  const increaseTime = async (seconds: number) => {
    await network.provider.send("evm_increaseTime", [seconds]);
    await network.provider.send("evm_mine");
  };

  //   create trades
  await dex.connect(trader1).createLimitOrder(BAT, 1000, 10, Status.BUY);
  await dex.connect(trader2).createMarketOrder(BAT, 1000, Status.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(BAT, 1200, 11, Status.BUY);
  await dex.connect(trader2).createMarketOrder(BAT, 1200, Status.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(BAT, 1200, 15, Status.BUY);
  await dex.connect(trader2).createMarketOrder(BAT, 1200, Status.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(BAT, 1500, 14, Status.BUY);
  await dex.connect(trader2).createMarketOrder(BAT, 1500, Status.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(BAT, 2000, 12, Status.BUY);
  await dex.connect(trader2).createMarketOrder(BAT, 2000, Status.SELL);

  await dex.connect(trader1).createLimitOrder(REP, 1000, 2, Status.BUY);
  await dex.connect(trader2).createMarketOrder(REP, 1000, Status.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(REP, 500, 4, Status.BUY);
  await dex.connect(trader2).createMarketOrder(REP, 500, Status.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(REP, 800, 2, Status.BUY);
  await dex.connect(trader2).createMarketOrder(REP, 800, Status.SELL);
  await increaseTime(1);
  await dex.connect(trader1).createLimitOrder(REP, 1200, 6, Status.BUY);
  await dex.connect(trader2).createMarketOrder(REP, 1200, Status.SELL);

  //create orders
  await dex.connect(trader1).createLimitOrder(BAT, 1400, 10, Status.BUY);
  await dex.connect(trader2).createLimitOrder(BAT, 1200, 11, Status.BUY);
  await dex.connect(trader2).createLimitOrder(BAT, 1000, 12, Status.BUY);

  await dex.connect(trader1).createLimitOrder(REP, 3000, 4, Status.BUY);
  await dex.connect(trader1).createLimitOrder(REP, 2000, 5, Status.BUY);
  await dex.connect(trader2).createLimitOrder(REP, 500, 6, Status.BUY);

  await dex.connect(trader1).createLimitOrder(ZRX, 4000, 12, Status.BUY);
  await dex.connect(trader1).createLimitOrder(ZRX, 3000, 13, Status.BUY);
  await dex.connect(trader2).createLimitOrder(ZRX, 500, 14, Status.BUY);

  await dex.connect(trader3).createLimitOrder(BAT, 2000, 16, Status.SELL);
  await dex.connect(trader4).createLimitOrder(BAT, 3000, 15, Status.SELL);
  await dex.connect(trader4).createLimitOrder(BAT, 500, 14, Status.SELL);

  await dex.connect(trader3).createLimitOrder(REP, 4000, 10, Status.SELL);
  await dex.connect(trader3).createLimitOrder(REP, 2000, 9, Status.SELL);
  await dex.connect(trader4).createLimitOrder(REP, 800, 8, Status.SELL);

  await dex.connect(trader3).createLimitOrder(ZRX, 1500, 23, Status.SELL);
  await dex.connect(trader3).createLimitOrder(ZRX, 1200, 22, Status.SELL);
  await dex.connect(trader4).createLimitOrder(ZRX, 900, 21, Status.SELL);

  console.log(
    `REP ${await dex.connect(feeAccount).getBalance(REP)}`,
    `BAT ${await dex.connect(feeAccount).getBalance(BAT)}`,
    `ZRX ${await dex.connect(feeAccount).getBalance(ZRX)}`,
    `DAI ${await dex.connect(feeAccount).getBalance(DAI)}`
  );
}

function saveFrontendFiles(tokens: Contract[], tokenNames: string[]) {
  const contractDir = __dirname + "/../pages/contracts";

  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir);
  }

  const addresses = tokens.reduce((acc, next, i) => {
    return {
      ...acc,
      [tokenNames[i]]: next.address,
    };
  }, {});

  try {
    const json = JSON.stringify(addresses, undefined, 2);
    fs.writeFileSync(contractDir + "/token-addresses.json", json);
  } catch (err) {
    console.error(err);
  }

  const erc20Artifact = artifacts.readArtifactSync("Dai");
  try {
    fs.writeFileSync(
      contractDir + `/ERC20.json`,
      JSON.stringify(erc20Artifact, null, 2)
    );
  } catch (err) {
    console.log(`ERC20 artifact could not be written`);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
