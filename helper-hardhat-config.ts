export interface networkConfigItem {
  blockConfirmations?: number;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const developmentChains = ["hardhat", "localhost"];

export const networkConfig: networkConfigInfo = {
  localhost: {},
  hardhat: {},
  goerli: {
    blockConfirmations: 6,
  },
};

export const INITIAL_SUPPLY = "100000000000000000000";
