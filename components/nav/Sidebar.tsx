import React, { useState } from "react";
import Image from "next/image";
import CoinbaseLogo from "/public/cb-logo.png";
import { navItems } from "../../static/NavItems";
import {
  Wrapper,
  LogoContainer,
  Logo,
  NavItemsContainer,
  NavItem,
  NavIcon,
  NavTitle,
} from "../../styles/sidebar.styled";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const [activeIcon, setActiveIcon] = useState("");
  const router = useRouter();

  return (
    <Wrapper>
      <LogoContainer>
        <Logo>
          <Image src={CoinbaseLogo} alt="Coinbase Logo" width={200} />
        </Logo>
      </LogoContainer>
      <NavItemsContainer>
        {navItems.map((nav, i) => (
          <NavItem key={i} onClick={() => setActiveIcon(nav.title)}>
            <NavIcon style={{ color: nav.title === activeIcon && "#3773f5" }}>
              {nav.icon}
            </NavIcon>
            <NavTitle>
              <Link as={nav.as} href={nav.path}>
                {nav.title}
              </Link>
            </NavTitle>
          </NavItem>
        ))}
      </NavItemsContainer>
    </Wrapper>
  );
};

export default Sidebar;
