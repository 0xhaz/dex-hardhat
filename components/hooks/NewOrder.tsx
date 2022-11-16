import React, { useState } from "react";
import {
  Wrapper,
  Header,
  Title,
  Tabs,
  Button,
  selectedStyle,
  unselectedStyle,
  Label,
  Input,
} from "../../styles/neworder.styled";
import { useAppState, useExchangeData } from "../../contexts/index";

const Type = {
  LIMIT: "LIMIT",
  MARKET: "MARKET",
};

const Status = {
  BUY: 0,
  SELL: 1,
};

const initialData = {
  type: null,
  status: null,
  amount: null,
  price: null,
};

const NewOrder = () => {
  const {
    state: { selectedMarket },
  } = useAppState();
  const { createMarketOrder, createLimitOrder } = useExchangeData();
  const [form, setForm] = useState(initialData);

  const change = (k: string) => (value: string | number) => {
    setForm(s => ({
      ...s,
      [k]: value,
    }));
  };

  const handleSave = () => {
    if (form.amount && form.type && form.status) {
      if (form.type === Type.MARKET) {
        createMarketOrder(form.amount, form.status);
      } else if (form.type === Type.LIMIT && form.price) {
        createLimitOrder(form.amount, form.price, form.status);
      }
    }
  };

  if (selectedMarket === "DAI") {
    return null;
  }

  return (
    <Wrapper>
      <Header>
        <Title>New Order for {selectedMarket}</Title>
      </Header>
      <div>
        <Tabs>
          <span>
            <Button
              style={form.type === Type.LIMIT ? selectedStyle : null}
              type="button"
              onClick={() => change("type")(Type.LIMIT)}
            >
              {Type.LIMIT}
            </Button>
            <Button
              style={form.type === Type.MARKET ? selectedStyle : null}
              type="button"
              onClick={() => change("type")(Type.MARKET)}
            >
              {Type.MARKET}
            </Button>
          </span>
        </Tabs>
        <Tabs>
          <span>
            <Button
              style={form.status === Status.BUY ? selectedStyle : null}
              type="button"
              onClick={() => change("side")(Status.BUY)}
            >
              BUY
            </Button>
            <Button
              style={form.status === Status.SELL ? selectedStyle : null}
              type="button"
              onClick={() => change("side")(Status.SELL)}
            >
              SELL
            </Button>
          </span>
        </Tabs>

        {form.type === Type.MARKET ? null : (
          <div>
            <Label htmlFor="Price">Price</Label>
            <Input
              type="number"
              value={form.price || ""}
              onChange={e => change("price")(e.target.value)}
              name="price"
              id="price"
              placeholder="Enter price for order"
            />
          </div>
        )}

        <div>
          <Label htmlFor="Amount">Amount</Label>
          <Input
            type="number"
            value={form.amount || ""}
            onChange={e => change("amount")(e.target.value)}
            name="amount"
            id="amount"
            placeholder="Enter amount for order"
          />
        </div>
      </div>
      <div>
        <div>
          <Button type="button" onClick={() => setForm(initialData)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Send
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default NewOrder;
