import React from "react";
import { useExchangeData } from "../../contexts/index";

const OrderBook = () => {
  const { orders } = useExchangeData();
  return (
    <div>
      <div>
        <h2>Order Book</h2>
      </div>

      <div>
        <table>
          <caption>Selling</caption>
          <thead>
            <tr>
              <th>BAT</th>
              <th>BAT/DAI</th>
              <th>DAI</th>
            </tr>
          </thead>
          <tbody>
            {/* Sell Orders */}
            {orders &&
              orders.sell.map((o, i) => {
                return (
                  <tr key={i}>
                    <td>{o.amount.toString()}</td>
                    <td>{o.price.toString()}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderBook;
