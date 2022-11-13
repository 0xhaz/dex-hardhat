import React from "react";
import { useExchangeData } from "../../contexts/index";
import { formatDate } from "../../utils/dates";
import Image from "next/image";
import {
  Wrapper,
  Header,
  Title,
  Orders,
  AltText,
  Table,
  Divider,
  Caption,
  Th,
  Td,
} from "../../styles/orderbook.styled";

const OrderBook = () => {
  const { orders } = useExchangeData();
  return (
    <Wrapper>
      <Header>
        <Title>Order Book</Title>
      </Header>

      <Orders>
        {!orders || orders.sell.length === 0 ? (
          <AltText>No Sell Orders</AltText>
        ) : (
          <Table>
            <Caption>Selling</Caption>
            <thead>
              <tr>
                <Th scope="col">
                  Amount
                  <Image src="/sort.svg" alt="Sort" width={30} height={20} />
                </Th>

                <Th scope="col">
                  Price
                  <Image src="/sort.svg" alt="Sort" width={30} height={20} />
                </Th>
                <Th scope="col">
                  Date
                  <Image src="/sort.svg" alt="Sort" width={30} height={20} />
                </Th>
              </tr>
            </thead>
            <tbody>
              {/* Sell Orders */}
              {orders &&
                orders.sell.map((order, i) => {
                  return (
                    <tr key={i}>
                      <Td>{order.amount.toString()}</Td>
                      <Td style={{ color: `#f45353` }}>
                        {order.price.toString()}
                      </Td>
                      <Td>{formatDate(order.date.toString())}</Td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        )}

        <Divider></Divider>

        {!orders || orders.buy.length === 0 ? (
          <AltText>No Buy Orders</AltText>
        ) : (
          <Table>
            <Caption>Buying</Caption>
            <thead>
              <tr>
                <Th scope="col">
                  Amount
                  <Image src="/sort.svg" alt="Sort" width={30} height={20} />
                </Th>
                <Th scope="col">
                  Price
                  <Image src="/sort.svg" alt="Sort" width={30} height={20} />
                </Th>
                <Th scope="col">
                  Date
                  <Image src="/sort.svg" alt="Sort" width={30} height={20} />
                </Th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.buy.map((order, i) => {
                  return (
                    <tr key={i}>
                      <Td>{order.amount.toString()}</Td>
                      <Td style={{ color: `#25ce8f` }}>
                        {order.price.toString()}
                      </Td>
                      <Td>{formatDate(order.date.toString())}</Td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        )}
      </Orders>
    </Wrapper>
  );
};

export default OrderBook;
