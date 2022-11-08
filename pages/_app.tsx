import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "../components/index";
import {
  AccountProvider,
  ContractProvider,
  AppStateProvider,
  ExchangeDataProvider,
} from "../contexts/index";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ContractProvider>
        <AccountProvider>
          <AppStateProvider>
            <ExchangeDataProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ExchangeDataProvider>
          </AppStateProvider>
        </AccountProvider>
      </ContractProvider>
    </>
  );
}
