import React from "react";
import {
  Wrapper,
  Main,
  NewOrderContainer,
  AllOrderContainer,
  TradeContainer,
  OrderContainer,
  MyOrderContainer,
  DropDownContainer,
  ChartContainer,
} from "../styles/trade.styled";
import { Dropdown, OrderBook, PriceChart } from "../components/index";
import { useContract, useAccount, useAppState } from "../contexts/index";

const Trade = () => {
  const { tokens } = useContract();
  const { account } = useAccount();
  const { state, dispatch } = useAppState();

  const handSelect = (market: string) => {
    dispatch({ type: "CHANGE_MARKET", payload: market });
  };
  return (
    <Wrapper>
      <Main>
        <DropDownContainer>
          {state.selectedMarket && <p>{state.selectedMarket}</p>}
          <Dropdown
            label={"Select Market"}
            items={Object.keys(tokens)}
            onSelect={handSelect}
          />
        </DropDownContainer>
        <PriceChart />
        <OrderBook />
      </Main>
    </Wrapper>
  );
};

export default Trade;
