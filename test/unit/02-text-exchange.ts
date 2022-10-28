import { deployments, ethers } from "hardhat";
import { expect } from "chai";
import {
  Bat,
  Dai,
  Rep,
  Zrx,
  Exchange,
  Exchange__factory,
} from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

type tokenBalance = {
  token: number;
  trader: string;
};

type accounts = {
  account: string;
};

const Status = {
  BUY: 0,
  SELL: 1,
};

const tokens = (n: number) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Exchange", () => {
  let dex: Exchange;
  let dai: Dai,
    rep: Rep,
    bat: Bat,
    zrx: Zrx,
    trader1: SignerWithAddress,
    trader2: SignerWithAddress,
    feeAccount: SignerWithAddress,
    deployer: SignerWithAddress,
    accounts: SignerWithAddress[];

  const feePercent = 10;

  const [DAI, BAT, REP, ZRX] = ["DAI", "BAT", "REP", "ZRX"].map(ticker =>
    ethers.utils.formatBytes32String(ticker)
  );

  beforeEach(async () => {
    await deployments.fixture(["all"]);
    [deployer, feeAccount, trader1, trader2] = await ethers.getSigners();

    const daiFactory = await ethers.getContractFactory("Dai");
    const batFactory = await ethers.getContractFactory("Bat");
    const repFactory = await ethers.getContractFactory("Rep");
    const zrxFactory = await ethers.getContractFactory("Zrx");

    // @ts-ignore
    [dai, bat, rep, zrx] = await Promise.all([
      daiFactory.deploy(),
      batFactory.deploy(),
      repFactory.deploy(),
      zrxFactory.deploy(),
    ]);

    const dexFactory = (await ethers.getContractFactory(
      "Exchange"
    )) as Exchange__factory;

    dex = await dexFactory.deploy(feeAccount.address, feePercent);

    await Promise.all([
      dex.connect(deployer).addToken(DAI, dai.address),
      dex.connect(deployer).addToken(BAT, bat.address),
      dex.connect(deployer).addToken(REP, rep.address),
      dex.connect(deployer).addToken(ZRX, zrx.address),
    ]);

    const amount = tokens(1000);

    const seedTokenBalance = async (token: any, trader: any) => {
      await token.faucet(trader.address, amount);
      await token.connect(trader).approve(dex.address, amount);
    };

    await Promise.all(
      [dai, bat, rep, zrx].map(token => seedTokenBalance(token, trader1))
    );

    await Promise.all(
      [dai, bat, rep, zrx].map(token => seedTokenBalance(token, trader2))
    );
  });

  describe("Deployment", () => {
    it("tracks the fee account", async () => {
      expect(await dex.i_feeAccount()).to.equal(feeAccount.address);
    });
    it("tracks the fee percent", async () => {
      expect(await dex.i_feePercent()).to.equal(feePercent);
    });
  });
});
