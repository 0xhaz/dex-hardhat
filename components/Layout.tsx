import React, { ReactElement, useState } from "react";
import { Sidebar, Header } from "./index";
import { Wrapper, MainContainer } from "../styles/layout.styled";

interface LayoutProps {
  children?: React.ReactNode;
  address: string;
}

const Layout = ({ children, address }: LayoutProps) => {
  return (
    <Wrapper>
      <Sidebar />
      <MainContainer>
        <Header walletAddress={address} />
        <main>{children}</main>
      </MainContainer>
    </Wrapper>
  );
};

export default Layout;
