import React, { ReactElement, useState } from "react";
import { Sidebar, Header } from "./index";
import { Wrapper, MainContainer } from "../styles/layout.styled";

interface LayoutProps {
  children?: React.ReactNode;
  address: string;
}

const Layout = () => {
  return (
    <Wrapper>
      <Sidebar />
      <MainContainer>
        <Header />
        <main></main>
      </MainContainer>
    </Wrapper>
  );
};

export default Layout;
