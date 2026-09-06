import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

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

    // Fetch immediately
    fetchHoldings();

    // Fetch every 5 seconds
    const interval = setInterval(fetchHoldings, 5000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  // Total Investment
  const totalInvestment = allHoldings.reduce((total, stock) => {
    return total + Number(stock.avg || 0) * Number(stock.qty || 0);
  }, 0);

  // Current Value
  const currentValue = allHoldings.reduce((total, stock) => {
    return total + Number(stock.price || 0) * Number(stock.qty || 0);
  }, 0);

  // Total P&L
  const totalProfitLoss = currentValue - totalInvestment;

  // P&L percentage
  const profitLossPercentage =
    totalInvestment > 0
      ? (totalProfitLoss / totalInvestment) * 100
      : 0;

  const totalPLClass = totalProfitLoss >= 0 ? "profit" : "loss";

  // Graph data
  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => Number(stock.price || 0)),
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
              const price = Number(stock.price || 0);

              const investment = avg * qty;
              const curValue = price * qty;
              const profitLoss = curValue - investment;

              const isProfit = profitLoss >= 0;
              const profClass = isProfit ? "profit" : "loss";

              // Fix for day change
              const dayValue = String(stock.day || "");
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
                    {stock.net}
                  </td>

                  <td className={dayClass}>
                    {stock.day}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            {totalInvestment.toFixed(2)}
          </h5>
          <p>Total investment</p>
        </div>

        <div className="col">
          <h5>
            {currentValue.toFixed(2)}
          </h5>
          <p>Current value</p>
        </div>

        <div className="col">
          <h5 className={totalPLClass}>
            {totalProfitLoss.toFixed(2)}{" "}
            ({profitLossPercentage.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;