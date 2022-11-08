import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { WalletModal } from "../index";
import {
  Wrapper,
  Button,
  Title,
  ButtonsContainer,
  myBlockies,
  Text,
  customStyles,
} from "../../styles/header.styled";
import { useAccount } from "../../contexts/index";

export type headerProps = {
  walletAddress: string;
};

const Header = ({ walletAddress }: headerProps) => {
  const router = useRouter();

  const ButtonGroup = () => {
    const { connect, account } = useAccount();

    return account ? (
      <Text>
        <a>
          {account.slice(0, 5)}...{account.slice(38, 42)}
        </a>
      </Text>
    ) : (
      <Button
        style={{ backgroundColor: "#3773f5", color: "#000" }}
        onClick={connect}
      >
        Connect
      </Button>
    );
  };

  return (
    <Wrapper>
      <Title>Assets</Title>
      <ButtonsContainer>
        <Link href={"/?deposit=1"}>
          <Button style={{ backgroundColor: "#3773f5", color: "#000" }}>
            Wallet
          </Button>
        </Link>
        <ButtonGroup />
      </ButtonsContainer>
      <Modal
        isOpen={!!router.query.deposit}
        onRequestClose={() => router.push("")}
        style={customStyles}
      >
        <WalletModal />
      </Modal>
    </Wrapper>
  );
};

export default Header;
