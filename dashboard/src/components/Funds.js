import React, { useEffect, useState } from "react";
import axios from "axios";

const Funds = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [message, setMessage] = useState("");

  const API = "https://stockverse-mern.onrender.com";

  // ==================== GET FUNDS ====================
  const fetchFunds = async () => {
    try {
      const res = await axios.get(`${API}/funds`);
      setBalance(Number(res.data.balance) || 0);
    } catch (error) {
      console.log("Funds Error:", error);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  // ==================== ADD FUNDS ====================
  const handleAddFunds = async () => {
    const value = Number(amount);

    if (!value || value <= 0) {
      setMessage("Please enter a valid amount");
      return;
    }

    try {
      const res = await axios.post(`${API}/addFunds`, {
        amount: value,
      });

      setBalance(Number(res.data.balance));
      setAmount("");
      setShowAdd(false);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to add funds"
      );
    }
  };

  // ==================== WITHDRAW FUNDS ====================
  const handleWithdraw = async () => {
    const value = Number(amount);

    if (!value || value <= 0) {
      setMessage("Please enter a valid amount");
      return;
    }

    if (value > balance) {
      setMessage("Insufficient balance");
      return;
    }

    try {
      const res = await axios.post(`${API}/withdrawFunds`, {
        amount: value,
      });

      setBalance(Number(res.data.balance));
      setAmount("");
      setShowWithdraw(false);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to withdraw funds"
      );
    }
  };

  // ==================== CLOSE ====================
  const closeBox = () => {
    setShowAdd(false);
    setShowWithdraw(false);
    setAmount("");
    setMessage("");
  };

  return (
    <>
      {/* ==================== TOP BUTTONS ==================== */}
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI</p>

        <button
          className="btn btn-green"
          onClick={() => {
            setShowAdd(true);
            setShowWithdraw(false);
            setMessage("");
          }}
        >
          Add funds
        </button>

        <button
          className="btn btn-blue"
          onClick={() => {
            setShowWithdraw(true);
            setShowAdd(false);
            setMessage("");
          }}
        >
          Withdraw
        </button>
      </div>

      {/* ==================== MESSAGE ==================== */}
      {message && (
        <div
          style={{
            textAlign: "center",
            marginTop: "15px",
            fontSize: "14px",
          }}
        >
          {message}
        </div>
      )}

      {/* ==================== ADD FUNDS BOX ==================== */}
      {showAdd && (
        <div
          style={{
            width: "350px",
            margin: "25px auto",
            padding: "25px",
            border: "1px solid #ddd",
            background: "#fff",
          }}
        >
          <h3>Add Funds</h3>

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              margin: "15px 0",
              boxSizing: "border-box",
            }}
          />

          <button
            className="btn btn-green"
            onClick={handleAddFunds}
          >
            Add
          </button>

          <button
            className="btn btn-blue"
            onClick={closeBox}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ==================== WITHDRAW BOX ==================== */}
      {showWithdraw && (
        <div
          style={{
            width: "350px",
            margin: "25px auto",
            padding: "25px",
            border: "1px solid #ddd",
            background: "#fff",
          }}
        >
          <h3>Withdraw Funds</h3>

          <p>
            Available Balance: ₹{balance.toFixed(2)}
          </p>

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              margin: "15px 0",
              boxSizing: "border-box",
            }}
          />

          <button
            className="btn btn-blue"
            onClick={handleWithdraw}
          >
            Withdraw
          </button>

          <button
            className="btn btn-green"
            onClick={closeBox}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ==================== FUNDS DETAILS ==================== */}
      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">
                {balance.toFixed(2)}
              </p>
            </div>

            <div className="data">
              <p>Used margin</p>
              <p className="imp">0.00</p>
            </div>

            <div className="data">
              <p>Available cash</p>
              <p className="imp">
                {balance.toFixed(2)}
              </p>
            </div>

            <hr />

            <div className="data">
              <p>Opening Balance</p>
              <p>{balance.toFixed(2)}</p>
            </div>

            <div className="data">
              <p>Payin</p>
              <p>{balance.toFixed(2)}</p>
            </div>

            <div className="data">
              <p>SPAN</p>
              <p>0.00</p>
            </div>

            <div className="data">
              <p>Delivery margin</p>
              <p>0.00</p>
            </div>

            <div className="data">
              <p>Exposure</p>
              <p>0.00</p>
            </div>

            <div className="data">
              <p>Options premium</p>
              <p>0.00</p>
            </div>

            <hr />

            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>0.00</p>
            </div>

            <div className="data">
              <p>Collateral (Equity)</p>
              <p>0.00</p>
            </div>

            <div className="data">
              <p>Total Collateral</p>
              <p>0.00</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account</p>

            <button className="btn btn-blue">
              Open Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;