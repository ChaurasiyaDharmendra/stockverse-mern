import React, { useEffect, useState } from "react";
import axios from "axios";

const Funds = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [message, setMessage] = useState("");

  const API = "https://stockverse-mern.onrender.com";

  // ==================== GET BALANCE ====================
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
      {/* ==================== FUNDS HEADER ==================== */}
      <div className="funds">
        <p>Manage your funds</p>

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
        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
          }}
        >
          {message}
        </p>
      )}

      {/* ==================== ADD FUNDS ==================== */}
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

      {/* ==================== WITHDRAW ==================== */}
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

      {/* ==================== BALANCE ==================== */}
      <div className="row">
        <div className="col">
          <span>
            <p>Funds</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available Balance</p>
              <p className="imp colored">
                ₹{balance.toFixed(2)}
              </p>
            </div>

            <div className="data">
              <p>Withdrawable Balance</p>
              <p className="imp">
                ₹{balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;