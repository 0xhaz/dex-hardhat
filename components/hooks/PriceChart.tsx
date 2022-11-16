import React from "react";
import Image from "next/image";
import Chart from "react-apexcharts";
import dynamic from "next/dynamic";
import { options, series } from "../../utils/PriceChart.config";
import arrowUp from "/public/up-arrow.svg";
import arrowDown from "/public/down-arrow.svg";
import { Wrapper, Header, Flex, Title } from "../../styles/pricechart.styled";
import { useAccount, useAppState, useExchangeData } from "../../contexts/index";

export type PriceChartProps = {
  label: string;
};

const PriceChart = () => {
  const { state } = useAppState();
  const { account } = useAccount();
  const { priceChart } = useExchangeData();
  const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

  return (
    <Wrapper>
      <Header>
        <Flex>
          {state.selectedMarket && <Title>{state.selectedMarket}/DAI</Title>}
          <Flex>
            <Image src={arrowDown} alt="Arrow" />
            <span className="up"></span>
          </Flex>
        </Flex>
      </Header>

      {!account ? (
        <p>Please connect with Metamask</p>
      ) : (
        // @ts-ignore
        <Chart
          type="candlestick"
          options={options}
          series={series}
          width="100%"
          height="100%"
        />
      )}
    </Wrapper>
  );
};

export default PriceChart;
