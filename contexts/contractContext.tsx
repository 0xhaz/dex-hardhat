import { ethers, providers } from "ethers";
import React, { createContext, useContext } from "react";
import contractAddress from "../pages/contracts/contract-address.json";
import ERC20 from "../pages/contracts/ERC20.json";
import ContractArtifact from "../pages/contracts/Exchange.json";
import tokenAddresses from "../pages/contracts/token-addresses.json";

type Contract = Record<string, any> | null;

export type ContractContextValue = {
  contract: Contract;
  provider: providers.Provider | null;
  tokens: Record<string, Contract>;
};

export type ContractProviderProps = {
  children: React.ReactNode;
};

export const ContractContext = createContext<ContractContextValue>({
  contract: null,
  provider: null,
  tokens: {},
});

const getTokens = (provider: providers.Provider, tokenNames: string[]) => {
  return tokenNames.reduce((acc, next: string) => {
    // @ts-ignore
    const addr = tokenAddresses[next];
    const token = new ethers.Contract(addr, ERC20.abi, provider);
    return {
      ...acc,
      [next.toUpperCase()]: token,
    };
  }, {});
};

export const ContractProvider = ({ children }: ContractProviderProps) => {
  const provider = getProvider();
  const contract = new ethers.Contract(
    contractAddress.Exchange,
    ContractArtifact.abi,
    provider
  );

  const tokenNames = ["Dai", "Bat", "Zrx", "Rep"];
  const tokens = getTokens(provider, tokenNames);

  const loadNetwork = async provider => {
    const { chainId } = await provider.getNetwork();
    console.log(chainId);
    return chainId;
  };

  return (
    <ContractContext.Provider value={{ contract, provider, tokens }}>
      {children}
    </ContractContext.Provider>
  );
};

export function useContract() {
  return useContext(ContractContext);
}

const getProvider = () => {
  let provider;

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "goerli") {
    provider = new ethers.providers.InfuraProvider(
      "goerli",
      process.env.NEXT_PUBLIC_INFURA_API_KEY
    );
  } else {
    provider = new ethers.providers.JsonRpcProvider();
  }
  return provider;
};
