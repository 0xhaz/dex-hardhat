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
  currentBalance: number | null;
  tokenBalance: number | null;
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
        await contractWithSigner.deposit(
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
        await contractWithSigner.withdraw(
          ethers.utils.formatBytes32String(ticker),
          ethers.utils.parseUnits(amount)
        );
      } catch (err) {
        console.log(err);
      }
      await fetchBalances(account, ticker);
    }
  };

  const fetchBalances = useCallback(
    async (address: string, ticker: string) => {
      try {
        const signer = await accountProvider?.getSigner();
        const balance = await contract
          ?.connect(signer)
          .getBalance(ethers.utils.formatBytes32String(ticker));

        setCurrentBalance(balance);
      } catch (err) {
        console.log(err);
      }
    },
    [contract, tokens, accountProvider]
  );

  useEffect(() => {
    if (account && selectedMarket) {
      fetchBalances(account, selectedMarket);
    }
  }, [fetchBalances, selectedMarket]);

  return (
    <ExchangeDataContext.Provider
      value={{ deposit, withdraw, currentBalance, tokenBalance }}
    >
      {children}
    </ExchangeDataContext.Provider>
  );
};

export const useExchangeData = () => {
  return useContext(ExchangeDataContext);
};
