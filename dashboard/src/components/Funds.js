import React, { useEffect, useState } from "react";
import axios from "axios";

const Funds = () => {
  const [balance, setBalance] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");

  const API_URL = "https://stockverse-mern.onrender.com";

  const fetchFunds = async () => {
    try {
      const res = await axios.get(`${API_URL}/funds`);
      setBalance(Number(res.data.balance));
    } catch (error) {
      console.log("Funds Error:", error);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleAddFunds = async () => {
    const value = Number(amount);

    if (!value || value <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/addFunds`, {
        amount: value,
      });

      alert(res.data.message);

      setAmount("");
      setShowAdd(false);
      fetchFunds();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to add funds");
    }
  };

  const handleWithdraw = async () => {
    const value = Number(amount);

    if (!value || value <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/withdrawFunds`, {
        amount: value,
      });

      alert(res.data.message);

      setAmount("");
      setShowWithdraw(false);
      fetchFunds();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to withdraw funds");
    }
  };

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI</p>

        <button
          className="btn btn-green"
          onClick={() => {
            setAmount("");
            setShowAdd(true);
          }}
        >
          Add funds
        </button>

        <button
          className="btn btn-blue"
          onClick={() => {
            setAmount("");
            setShowWithdraw(true);
          }}
        >
          Withdraw
        </button>
      </div>

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

      {/* ADD FUNDS */}

      {showAdd && (
        <div className="fund-modal">
          <div className="fund-modal-box">
            <h3>Add Funds</h3>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div>
              <button
                className="btn btn-green"
                onClick={handleAddFunds}
              >
                Add
              </button>

              <button
                className="btn btn-blue"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAW FUNDS */}

      {showWithdraw && (
        <div className="fund-modal">
          <div className="fund-modal-box">
            <h3>Withdraw Funds</h3>

            <p>
              Available balance: ₹{balance.toFixed(2)}
            </p>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div>
              <button
                className="btn btn-green"
                onClick={handleWithdraw}
              >
                Withdraw
              </button>

              <button
                className="btn btn-blue"
                onClick={() => setShowWithdraw(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Funds;