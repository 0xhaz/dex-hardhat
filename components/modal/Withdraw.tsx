import React, { useState } from "react";
import { ethers } from "ethers";
import { useAppState, useExchangeData } from "../../contexts/index";
import {
  Wrapper,
  SVG,
  Container,
  InputContainer,
  Label,
  Input,
  Button,
  ButtonContainer,
  WalletContainer,
  Title,
  Account,
} from "../../styles/withdraw.styled";

const formInitialValues = { direction: null, amount: null };

const Withdraw = ({ account }: { account: string }) => {
  const {
    state: { selectedMarket },
  } = useAppState();

  const { currentBalance, tokenBalance, withdraw } = useExchangeData();
  const [form, setForm] = useState(formInitialValues);

  const change = (key: string) => (value: string) => {
    setForm(s => ({
      ...s,
      [key]: value,
    }));
  };

  const handleSave = () => {
    if (selectedMarket && form.amount) {
      withdraw(selectedMarket, form.amount);
      setForm(formInitialValues);
    }
  };

  return (
    <Wrapper>
      <div>
        <div>
          <div>
            <WalletContainer>
              <SVG
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="bi bi-wallet2"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#3773f5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"
                />
              </SVG>
              <div>
                <Title>Wallet Address</Title>
                <Account>{`${account.slice(0, 26)}...${account.slice(
                  35
                )}`}</Account>
              </div>
            </WalletContainer>

            {currentBalance && (
              <WalletContainer>
                <SVG
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="#3773f5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </SVG>
              </WalletContainer>
            )}

            {tokenBalance && (
              <WalletContainer>
                <SVG>
                  <path />
                </SVG>
                <div>
                  <Title>Available in Wallet</Title>
                  <Account>{`${ethers.utils.formatEther(
                    tokenBalance
                  )} ${selectedMarket}`}</Account>
                </div>
              </WalletContainer>
            )}
          </div>

          <Container>
            <InputContainer>
              <div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    type="number"
                    value={form.amount || ""}
                    onChange={e => change("amount")(e.target.value)}
                    name="amount"
                    id="amount"
                    placeholder="Enter amount to withdraw"
                  />
                </div>
              </div>
              <ButtonContainer>
                <Button
                  type="button"
                  onClick={() => setForm(formInitialValues)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleSave}>
                  Send
                </Button>
              </ButtonContainer>
            </InputContainer>
          </Container>
        </div>
      </div>
    </Wrapper>
  );
};

export default Withdraw;
