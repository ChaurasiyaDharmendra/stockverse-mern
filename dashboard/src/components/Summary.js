import React, { useEffect, useState } from "react";
import axios from "axios";

const Summary = () => {
  const [funds, setFunds] = useState(0);
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [fundsRes, holdingsRes] = await Promise.all([
          axios.get("https://stockverse-mern.onrender.com/funds"),
          axios.get("https://stockverse-mern.onrender.com/allHoldings"),
        ]);

        setFunds(Number(fundsRes.data.balance) || 0);
        setHoldings(holdingsRes.data || []);
      } catch (error) {
        console.log("Dashboard data error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Holdings calculations
  const investment = holdings.reduce(
    (total, item) =>
      total + Number(item.avg || 0) * Number(item.qty || 0),
    0
  );

  const currentValue = holdings.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  const pnl = currentValue - investment;

  const pnlPercentage =
    investment > 0 ? (pnl / investment) * 100 : 0;

  const formatAmount = (amount) => {
    return `₹${Number(amount).toFixed(2)}`;
  };

  return (
    <>
      <div className="username">
        <h6>Hi, User!</h6>
        <hr className="divider" />
      </div>

      {/* ================= EQUITY ================= */}
      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{formatAmount(funds)}</h3>
            <p>Margin available</p>
          </div>

          <hr />

          <div className="second">
            <p>
              Margins used <span>{formatAmount(investment)}</span>
            </p>

            <p>
              Opening balance <span>{formatAmount(funds + investment)}</span>
            </p>
          </div>
        </div>

        <hr className="divider" />
      </div>

      {/* ================= HOLDINGS ================= */}
      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={pnl >= 0 ? "profit" : "loss"}>
              {formatAmount(pnl)}{" "}
              <small>
                {pnl >= 0 ? "+" : ""}
                {pnlPercentage.toFixed(2)}%
              </small>
            </h3>

            <p>P&L</p>
          </div>

          <hr />

          <div className="second">
            <p>
              Current Value <span>{formatAmount(currentValue)}</span>
            </p>

            <p>
              Investment <span>{formatAmount(investment)}</span>
            </p>
          </div>
        </div>

        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;