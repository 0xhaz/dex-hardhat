import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from "react";
import { ethers } from "ethers";
import { useContract, useAccount, useAppState } from "./index";

export type ExchangeDataContextValue = {
  deposit: (arg0: string, arg1: string) => void;
  withdraw: (arg0: string, arg1: string) => void;
  createMarketOrder: (arg0: string, arg1: number) => void;
  createLimitOrder: (arg0: string, arg1: string, arg2: number) => void;
  currentBalance: number | null;
  tokenBalance: number | null;
  orders: { buy: any[]; sell: any[] };
  trades: any[];
};

export const ExchangeDataContext = createContext<ExchangeDataContextValue>(
  {} as ExchangeDataContextValue
);

export type ExchangeDataProviderProps = {
  children: React.ReactNode;
};

export const ExchangeDataProvider = ({
  children,
}: ExchangeDataProviderProps): JSX.Element => {
  const { contract, tokens } = useContract();
  const { account, accountProvider } = useAccount();
  const {
    state: { selectedMarket },
  } = useAppState();

  const [orders, setOrders] = useState({ buy: [], sell: [] });
  const [currentBalance, setCurrentBalance] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [trades, setTrades] = useState([]);

  const deposit = async (ticker: string, amount: string) => {
    if (account) {
      const signer = accountProvider?.getSigner();
      const contractWithSigner = contract?.connect(signer);
      const token = tokens[ticker];
      try {
        const tx = await token
          ?.connect(signer)
          .approve(contract?.address, ethers.utils.parseUnits(amount));
        await tx.wait();
      } catch (err) {
        console.log(err);
      }

      try {
        await contractWithSigner.depositToken(
          ethers.utils.formatBytes32String(ticker),
          ethers.utils.parseUnits(amount)
        );
      } catch (err) {
        console.error(err);
      }
      await fetchBalances(account, ticker);
    }
  };

  const withdraw = async (ticker: string, amount: string) => {
    if (account) {
      const signer = accountProvider?.getSigner();
      const contractWithSigner = contract?.connect(signer);
      try {
        await contractWithSigner.withdrawToken(
          ethers.utils.formatBytes32String(ticker),
          ethers.utils.parseUnits(amount)
        );
      } catch (err) {
        console.log(err);
      }
      await fetchBalances(account, ticker);
    }
  };

  const createLimitOrder = useCallback(
    async (amount: string, price: string, status: number) => {
      if (selectedMarket) {
        const signer = accountProvider?.getSigner();
        const contractWithSigner = contract?.connect(signer);
        try {
          await contractWithSigner?.createLimit(
            ethers.utils.formatBytes32String(selectedMarket),
            ethers.utils.parseUnits(amount),
            ethers.utils.parseUnits(price),
            status
          );
        } catch (err) {
          console.log(err);
        }
      }
    },
    [selectedMarket, accountProvider, contract]
  );

  const createMarketOrder = useCallback(
    async (amount: string, status: number) => {
      if (selectedMarket) {
        const signer = await accountProvider?.getSigner();
        const contractWithSigner = contract?.connect(signer);
        try {
          await contractWithSigner?.createMarketOrder(
            ethers.utils.formatBytes32String(selectedMarket),
            ethers.utils.parseUnits(amount),
            status
          );
        } catch (err) {
          console.log(err);
        }
      }
    },
    [selectedMarket, accountProvider, contract]
  );

  const fetchOrders = useCallback(
    async (ticker: string) => {
      try {
        const os = await Promise.all([
          contract?.getOrders(ethers.utils.formatBytes32String(ticker), 0),
          contract?.getOrders(ethers.utils.formatBytes32String(ticker), 1),
        ]);
        setOrders({ buy: os[0], sell: os[1] });
      } catch (err) {
        console.log(err);
      }
    },
    [contract]
  );

  const fetchBalances = useCallback(
    async (address: string, ticker: string) => {
      try {
        const signer = await accountProvider?.getSigner();
        const balance = await contract
          ?.connect(signer)
          .getBalance(ethers.utils.formatBytes32String(ticker));
        console.log(balance.toString());

        setCurrentBalance(balance);

        console.log(balance.toString());
      } catch (err) {
        console.log(err);
      }
      try {
        const tokenB = await tokens[ticker]?.balanceOf(address);
        setTokenBalance(tokenB);
      } catch (err) {
        console.log(err);
      }
    },
    [contract, tokens, accountProvider]
  );

  const tradeHandler = useCallback(
    (
      tradeId: string,
      orderId: string,
      ticker: any,
      trader1: string,
      trader2: string,
      matched: any,
      price: any,
      date: any,
      event: any
    ) => {
      const trade = {
        tradeId,
        orderId,
        ticker: ethers.utils.parseBytes32String(ticker),
        trader1,
        trader2,
        matched,
        price,
        date,
      };
      //   @ts-ignore
      setTrades(ts => {
        return [trade, ...ts];
      });
    },
    [setTrades]
  );

  useEffect(() => {
    if (selectedMarket) {
      setTrades([]);

      const filter = contract?.filters.NewTrade(
        null,
        null,
        ethers.utils.formatBytes32String(selectedMarket)
      );
      contract?.on(filter, tradeHandler);
    }
  }, [selectedMarket, contract]);

  useEffect(() => {
    if (account && selectedMarket) {
      fetchOrders(selectedMarket);
      fetchBalances(account, selectedMarket);
    }
  }, [fetchOrders, fetchBalances, selectedMarket]);

  return (
    <ExchangeDataContext.Provider
      value={{
        deposit,
        withdraw,
        currentBalance,
        tokenBalance,
        orders,
        trades,
        createMarketOrder,
        createLimitOrder,
      }}
    >
      {children}
    </ExchangeDataContext.Provider>
  );
};

export const useExchangeData = () => {
  return useContext(ExchangeDataContext);
};
