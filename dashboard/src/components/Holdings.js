
import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import { watchlist } from "../data/data";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const res = await axios.get(
          "https://stockverse-mern.onrender.com/allHoldings"
        );
        setAllHoldings(res.data);
      } catch (err) {
        console.log("Error fetching holdings:", err);
      }
    };

    fetchHoldings();

    const interval = setInterval(fetchHoldings, 5000);

    return () => clearInterval(interval);
  }, []);

  // Get static market price from Watchlist
  const getCurrentPrice = (stock) => {
    const marketStock = watchlist.find(
      (item) => item.name === stock.name
    );

    return Number(
      marketStock?.price ?? stock.price ?? 0
    );
  };

  // Get static day change from Watchlist
  const getDayChange = (stock) => {
    const marketStock = watchlist.find(
      (item) => item.name === stock.name
    );

    return marketStock?.percent ?? stock.day ?? "0.00%";
  };

  // Total Investment
  const totalInvestment = allHoldings.reduce(
    (total, stock) => {
      const avg = Number(stock.avg || 0);
      const qty = Number(stock.qty || 0);

      return total + avg * qty;
    },
    0
  );

  // Current Value
  const currentValue = allHoldings.reduce(
    (total, stock) => {
      const price = getCurrentPrice(stock);
      const qty = Number(stock.qty || 0);

      return total + price * qty;
    },
    0
  );

  // Total P&L
  const totalProfitLoss = currentValue - totalInvestment;

  // P&L Percentage
  const profitLossPercentage =
    totalInvestment > 0
      ? (totalProfitLoss / totalInvestment) * 100
      : 0;

  const totalPLClass =
    totalProfitLoss >= 0 ? "profit" : "loss";

  // Graph data
  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Current Value",
        data: allHoldings.map((stock) => {
          const price = getCurrentPrice(stock);
          const qty = Number(stock.qty || 0);

          return price * qty;
        }),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">
        Holdings ({allHoldings.length})
      </h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {
              const qty = Number(stock.qty || 0);
              const avg = Number(stock.avg || 0);
              const price = getCurrentPrice(stock);

              const investment = avg * qty;
              const curValue = price * qty;
              const profitLoss = curValue - investment;

              const netChange =
                avg > 0
                  ? ((price - avg) / avg) * 100
                  : 0;

              const isProfit = profitLoss >= 0;
              const profClass = isProfit ? "profit" : "loss";

              const dayValue = String(getDayChange(stock));
              const dayClass = dayValue.startsWith("-")
                ? "loss"
                : "profit";

              return (
                <tr key={stock._id || index}>
                  <td>{stock.name}</td>
                  <td>{qty}</td>
                  <td>{avg.toFixed(2)}</td>
                  <td>{price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>

                  <td className={profClass}>
                    {profitLoss.toFixed(2)}
                  </td>

                  <td className={profClass}>
                    {netChange >= 0 ? "+" : ""}
                    {netChange.toFixed(2)}%
                  </td>

                  <td className={dayClass}>
                    {dayValue}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>

        <div className="col">
          <h5>{currentValue.toFixed(2)}</h5>
          <p>Current value</p>
        </div>

        <div className="col">
          <h5 className={totalPLClass}>
            {totalProfitLoss.toFixed(2)} (
            {profitLossPercentage.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;