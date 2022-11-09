import React from "react";
import { useAppState } from "../../contexts";

const Title = ({ children }) => {
  const { titleState, titleDispatch } = useAppState();
  return <div>{children.props}</div>;
};

export default Title;
