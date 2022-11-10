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
  return ethers.utils.parseEther(n.toString());
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
    account: SignerWithAddress[];

  const feePercent = 10;

  const [DAI, BAT, REP, ZRX] = ["DAI", "BAT", "REP", "ZRX"].map(ticker =>
    ethers.utils.formatBytes32String(ticker)
  );

  beforeEach(async () => {
    await deployments.fixture(["all"]);
    account = await ethers.getSigners();
    deployer = account[0];
    trader1 = account[1];
    trader2 = account[2];
    feeAccount = account[3];

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

    const seedTokenBalance = async (token: any, trader: any) => {
      const amount = tokens(1000);
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

  describe("Deposit Token", () => {
    describe("Success", () => {
      let amount = tokens(100);
      let result: any, deposit: any;
      beforeEach(async () => {
        deposit = await dex.connect(trader1).depositToken(DAI, amount);
        result = await deposit.wait();
      });

      it("deposit token to exchange", async () => {
        const balance = await dex.connect(trader1).getBalance(DAI);
        expect(balance.toString()).to.equal(amount.toString());
      });

      it("emits a Deposit event", async () => {
        const event = result.events[2];
        expect(event.event).to.equal("Deposit");

        const args = event.args;
        expect(args.ticker).to.equal(DAI);
        expect(args.user).to.equal(trader1.address);
        expect(args.amount).to.equal(amount);
        expect(args.balance).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("should not deposit unapproved tokens", async () => {
        let amount = tokens(100);
        const MKR = ethers.utils.formatBytes32String("MKR");
        await expect(dex.connect(trader1).depositToken(MKR, amount)).to.be
          .reverted;
      });
    });
  });

  describe("Withdraw Tokens", () => {
    let amount = tokens(100);
    let result: any, deposit: any, withdraw: any;

    describe("Success", () => {
      beforeEach(async () => {
        deposit = await dex.connect(trader1).depositToken(DAI, amount);
        result = await deposit.wait();
        withdraw = await dex.connect(trader1).withdrawToken(DAI, amount);
        result = await withdraw.wait();
      });

      it("withdraw token from exchange", async () => {
        const balance = await dex.connect(trader1).getBalance(DAI);
        expect(balance).to.equal(0);
      });

      it("emits a Withdraw event", async () => {
        const event = result.events[1];
        expect(event.event).to.equal("Withdraw");

        const args = event.args;
        expect(args.ticker).to.equal(DAI);
        expect(args.user).to.equal(trader1.address);
        expect(args.amount).to.equal(amount);
        expect(args.balance).to.equal(0);
      });
    });

    describe("Failure", () => {
      it("fails to withdraw invalid tokens", async () => {
        amount = tokens(100);
        const MKR = ethers.utils.formatBytes32String("MKR");
        await expect(dex.connect(trader1).withdrawToken(MKR, amount)).to.be
          .reverted;
      });

      it("should not withdraw amount bigger than current balance", async () => {
        amount = tokens(100);
        const wrongAmount = tokens(110);

        beforeEach(async () => {
          deposit = await dex.connect(trader1).depositToken(DAI, amount);
          result = await deposit.wait();
        });

        await expect(dex.connect(trader1).withdrawToken(DAI, wrongAmount)).to.be
          .reverted;
      });
    });
  });

  describe("Create Limit Order", () => {
    describe("Success", () => {
      let buyOrders: any, sellOrders: any;
      const amount = tokens(100);
      const amount2 = tokens(200);
      const tradeAmount = tokens(10);
      const price1 = 9;
      const price2 = 10;
      beforeEach(async () => {
        await dex.connect(trader1).depositToken(DAI, amount);

        await dex
          .connect(trader1)
          .createLimitOrder(REP, tradeAmount, price1, Status.BUY);
      });
      it("should create limit order", async () => {
        buyOrders = await dex.getOrders(REP, Status.BUY);
        sellOrders = await dex.getOrders(REP, Status.SELL);

        expect(buyOrders.length).to.equal(1);
        expect(buyOrders[0].trader).to.equal(trader1.address);
        expect(buyOrders[0].ticker).to.equal(
          ethers.utils.formatBytes32String("REP")
        );
        expect(buyOrders[0].price).to.equal(9);
        expect(sellOrders.length).to.equal(0);
      });

      it("should create a new limit order", async () => {
        await dex.connect(trader2).depositToken(DAI, amount2);

        await dex
          .connect(trader2)
          .createLimitOrder(REP, tradeAmount, price2, Status.BUY);

        buyOrders = await dex.getOrders(REP, Status.BUY);
        sellOrders = await dex.getOrders(REP, Status.SELL);

        expect(buyOrders.length).to.equal(2);
        expect(buyOrders[0].trader).to.equal(trader2.address);
        expect(buyOrders[1].trader).to.equal(trader1.address);
        expect(buyOrders[0].ticker).to.equal(
          ethers.utils.formatBytes32String("REP")
        );
        expect(buyOrders[1].ticker).to.equal(
          ethers.utils.formatBytes32String("REP")
        );
        expect(buyOrders[0].price).to.equal(10);
        expect(buyOrders[1].price).to.equal(9);
        expect(sellOrders.length).to.equal(0);
      });
    });

    describe("Failure", () => {
      let amount = tokens(100);
      const MKR = ethers.utils.formatBytes32String("MKR");
      let tradeAmount = tokens(10);
      const price1 = 9;
      const price2 = 10;
      beforeEach(async () => {
        await dex.connect(trader1).depositToken(DAI, amount);
      });
      it("should not create limit order if token does not exist", async () => {
        await expect(
          dex
            .connect(trader1)
            .createLimitOrder(MKR, tradeAmount, price1, Status.BUY)
        ).to.be.reverted;
      });
      it("should not create a limit order if token is DAI", async () => {
        await expect(
          dex
            .connect(trader1)
            .createLimitOrder(DAI, tradeAmount, price1, Status.BUY)
        ).to.be.reverted;
      });
      it("should not create limit order if token balance is too low", async () => {
        amount = tokens(99);
        await dex.connect(trader1).depositToken(REP, amount);

        tradeAmount = tokens(100);

        await expect(
          dex
            .connect(trader1)
            .createLimitOrder(REP, tradeAmount, price1, Status.SELL)
        ).to.be.reverted;
      });
      it("should not create limit order if DAI balance is too low", async () => {
        tradeAmount = tokens(100);

        await expect(
          dex
            .connect(trader1)
            .createLimitOrder(REP, tradeAmount, price2, Status.BUY)
        ).to.be.reverted;
      });
    });
  });

  describe("Create Market Order", () => {
    let amount = tokens(100);
    let tradeAmount = tokens(10);
    let tradeAmount2 = tokens(5);
    let price1 = 9;
    let price2 = 10;
    let transaction: any, result: any;
    beforeEach(async () => {
      await dex.connect(trader1).depositToken(DAI, amount);

      dex
        .connect(trader1)
        .createLimitOrder(REP, tradeAmount, price2, Status.BUY);

      await dex.connect(trader2).depositToken(REP, amount);

      transaction = await dex
        .connect(trader2)
        .createMarketOrder(REP, tradeAmount2, Status.SELL);
      result = await transaction.wait();
      // console.log(result.events);
    });
    describe("Success", () => {
      it("should create market order, match against existing limit order and charge fees", async () => {
        const balances = await Promise.all([
          dex.connect(trader1).getBalance(DAI),
          dex.connect(trader1).getBalance(REP),
          dex.connect(trader2).getBalance(DAI),
          dex.connect(trader2).getBalance(REP),
          dex.connect(feeAccount).getBalance(REP),
        ]);

        const orders = await dex.getOrders(REP, Status.BUY);

        expect(orders[0].filled).to.equal(tradeAmount2);
        expect(balances[0].toString()).to.equal(tokens(50));
        expect(balances[1].toString()).to.equal(tokens(4.5));
        expect(balances[2].toString()).to.equal(tokens(50));
        expect(balances[3].toString()).to.equal(tokens(95));
        expect(balances[4].toString()).to.equal(tokens(0.5));
      });

      it("should emit NewTrade event", async () => {
        const event = result.events[0];
        expect(event.event).to.equal("NewTrade");
        // console.log(event);

        const args = event.args;
        expect(args.tradeId).to.equal(1);
        expect(args.orderId).to.equal(0);
        expect(args.ticker).to.equal(REP);
        expect(args.trader1).to.equal(trader1.address);
        expect(args.trader2).to.equal(trader2.address);
        expect(args.amount).to.equal(tradeAmount2);
        expect(args.price).to.equal(price2);
        expect(args.date).to.at.least(1);
      });
    });

    describe("Failure", () => {
      let amount = tokens(100);
      let tradeAmount = tokens(10);
      let price1 = 9;
      beforeEach(async () => {
        await dex.connect(trader1).depositToken(DAI, amount);
      });
      it("should not create market order if token does not exist", async () => {
        const MKR = ethers.utils.formatBytes32String("MKR");
        await expect(
          dex
            .connect(trader1)
            .createLimitOrder(MKR, tradeAmount, price1, Status.BUY)
        ).to.be.reverted;
      });

      it("should not create market order if token is DAI", async () => {
        await expect(
          dex
            .connect(trader1)
            .createLimitOrder(DAI, tradeAmount, price1, Status.BUY)
        ).to.be.reverted;
      });

      it("should not create market order if token balance is too low", async () => {
        tradeAmount = tokens(1000);
        await expect(
          dex
            .connect(trader1)
            .createLimitOrder(REP, tradeAmount, price1, Status.BUY)
        ).to.be.reverted;
      });

      it("should not create market order if Dai balance is too low", async () => {
        tradeAmount = tokens(100);

        await dex.connect(trader1).depositToken(REP, amount);

        await dex
          .connect(trader1)
          .createLimitOrder(REP, tradeAmount, price1, Status.SELL);

        await expect(
          dex
            .connect(trader2)
            .createLimitOrder(REP, tradeAmount, price1, Status.BUY)
        ).to.be.reverted;
      });
    });
  });

  describe("Order Actions", async () => {
    let amount = tokens(100);
    let tradeAmount = tokens(1);
    let price1 = 9;
    let transaction: any, result: any;
    beforeEach(async () => {
      await dex.connect(trader1).depositToken(DAI, amount);

      await dex.connect(trader1).depositToken(REP, amount);

      transaction = await dex
        .connect(trader1)
        .createLimitOrder(REP, tradeAmount, price1, Status.BUY);
      result = await transaction.wait();

      await dex.connect(trader2).depositToken(DAI, amount);

      await dex.connect(trader2).depositToken(REP, amount);

      transaction = await dex
        .connect(trader2)
        .createMarketOrder(REP, tradeAmount, Status.SELL);
      result = await transaction.wait();
    });

    describe("Cancelling Orders", async () => {
      describe("Success", () => {
        beforeEach(async () => {
          transaction = await dex.connect(trader1).cancelOrder(REP, 1);
          result = await transaction.wait();
          transaction = await dex
            .connect(trader2)
            .cancelOrder(REP, 2, { from: trader2.address });
          result = await transaction.wait();
        });

        it("updates canceled orders", async () => {
          expect(await dex.s_orderCancelled(REP, 1)).to.equal(true);
          expect(await dex.s_orderCancelled(REP, 2)).to.equal(true);
        });

        it("emits a Cancel event", async () => {
          const event = result.events[0];
          console.log(event.toString());
          expect(event.event).to.equal("Cancel");
          const args = event.args;
          console.log(args);
          expect(args.tradeId).to.equal(1);
          expect(args.ticker).to.equal(REP);
          expect(args.trader).to.equal(trader1.address);
          expect(args.amount).to.equal(0);
          expect(args.price).to.equal(0);
          expect(args.date).to.at.least(1);
        });
      });
    });
  });
});
