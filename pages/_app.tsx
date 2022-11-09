import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "../components/index";
import {
  AccountProvider,
  ContractProvider,
  AppStateProvider,
  ExchangeDataProvider,
} from "../contexts/index";

type Props = {
  address: string;
};

export default function App(
  { Component, pageProps }: AppProps,
  { address }: Props
) {
  return (
    <>
      <ContractProvider>
        <AccountProvider>
          <AppStateProvider>
            <ExchangeDataProvider>
              <Layout address={address}>
                <Component {...pageProps} />
              </Layout>
            </ExchangeDataProvider>
          </AppStateProvider>
        </AccountProvider>
      </ContractProvider>
    </>
  );
}
