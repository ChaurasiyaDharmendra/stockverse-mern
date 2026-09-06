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
    const avg = Number(stock.avg || 0);
    const qty = Number(stock.qty || 0);

    return total + avg * qty;
  }, 0);

  // Current Value
  const currentValue = allHoldings.reduce((total, stock) => {
    const price = Number(stock.price || 0);
    const qty = Number(stock.qty || 0);

    return total + price * qty;
  }, 0);

  // Total P&L
  const totalProfitLoss = currentValue - totalInvestment;

  // P&L Percentage
  const profitLossPercentage =
    totalInvestment > 0
      ? (totalProfitLoss / totalInvestment) * 100
      : 0;

  // P&L class
  const totalPLClass = totalProfitLoss >= 0 ? "profit" : "loss";

  // Graph data
  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Current Value",
        data: allHoldings.map((stock) => {
          const price = Number(stock.price || 0);
          const qty = Number(stock.qty || 0);

          return price * qty;
        }),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      {/* Holdings Heading */}
      <h3 className="title">
        Holdings ({allHoldings.length})
      </h3>

      {/* Holdings Table */}
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

              // Investment
              const investment = avg * qty;

              // Current Value
              const curValue = price * qty;

              // Profit / Loss
              const profitLoss = curValue - investment;

              // Profit / Loss class
              const isProfit = profitLoss >= 0;
              const profClass = isProfit ? "profit" : "loss";

              // Day change
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

      {/* Portfolio Summary */}
      <div className="row">
        {/* Total Investment */}
        <div className="col">
          <h5>{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>

        {/* Current Value */}
        <div className="col">
          <h5>{currentValue.toFixed(2)}</h5>
          <p>Current value</p>
        </div>

        {/* Total P&L */}
        <div className="col">
          <h5 className={totalPLClass}>
            {totalProfitLoss.toFixed(2)} (
            {profitLossPercentage.toFixed(2)}%)
          </h5>

          <p>P&L</p>
        </div>
      </div>

      {/* Dynamic Holdings Graph */}
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;