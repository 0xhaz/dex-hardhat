import React, { useState } from "react";
import { Deposit, Withdraw } from "../index";
import { useAccount } from "../../contexts/index";
import {
  Wrapper,
  Selector,
  Option,
  selectedStyle,
  unselectedStyle,
  ModalMain,
} from "../../styles/walletModal.styled";

enum Options {
  deposit,
  withdraw,
}

type AccountProps = {
  account: any | undefined;
};

let options: Options = Options.deposit;

const WalletModal = () => {
  const [action, setAction] = useState<String>("deposit");
  const { account } = useAccount();

  const selectedModal = (option: Options) => {
    switch (option) {
      case "deposit":
        return <Deposit account={account} />;
      case "withdraw":
        return <Withdraw account={account} />;
      default:
        return <Deposit account={account} />;
    }
  };
  return (
    <Wrapper>
      <Selector>
        <Option
          style={action === "deposit" ? selectedStyle : unselectedStyle}
          onClick={() => setAction("deposit")}
        >
          <p>Deposit</p>
        </Option>
        <Option
          style={action === "withdraw" ? selectedStyle : unselectedStyle}
          onClick={() => setAction("withdraw")}
        >
          <p>Withdraw</p>
        </Option>
      </Selector>
      <ModalMain>{selectedModal(action)}</ModalMain>
    </Wrapper>
  );
};

export default WalletModal;
