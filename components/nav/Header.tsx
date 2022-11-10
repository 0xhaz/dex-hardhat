import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { WalletModal, Title } from "../index";
import propTypes from "prop-types";
import { navItems } from "../../static/NavItems";
import {
  Wrapper,
  Button,
  ButtonsContainer,
  TextTitle,
  Text,
  customStyles,
} from "../../styles/header.styled";
import { useAccount } from "../../contexts/index";

export type headerProps = {
  walletAddress: string;
  title: string;
};

const Header = ({ title }: headerProps) => {
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
      <TextTitle>
        <Title title={title} />
      </TextTitle>
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
        onRequestClose={() => router.push("/Trade")}
        ariaHideApp={false}
        style={customStyles}
      >
        <WalletModal />
      </Modal>
    </Wrapper>
  );
};

export default Header;

Header.propTypes = {
  title: propTypes.string,
};
