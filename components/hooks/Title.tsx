import React from "react";
import { useAppState } from "../../contexts";
import { useRouter } from "next/router";
import { navItems } from "../../static/NavItems";

const Title = ({ title }) => {
  const router = useRouter();
  return <div>{`${router.pathname === "/" ? title : ""}`}</div>;
};

export default Title;
