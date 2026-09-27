
import React, { useContext, useState } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";
import { Link } from "react-router-dom";
import { watchlist } from "../data/data";

const SellActionWindow = ({ uid }) => {
  const selectedStock = watchlist.find(
    (stock) => stock.name === uid
  );

  const currentMarketPrice = Number(
    selectedStock?.price || 0
  );

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(
    currentMarketPrice
  );

  const { closeSellWindow } = useContext(GeneralContext);

  const handleSellClick = async () => {
    if (Number(stockQuantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (Number(stockPrice) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      await axios.post(
        "https://stockverse-mern.onrender.com/newOrder",
        {
          name: uid,
          qty: Number(stockQuantity),
          price: Number(stockPrice),
          mode: "SELL",
        }
      );

      alert("Sell order placed successfully!");
      closeSellWindow();
    } catch (err) {
      console.error("Sell failed:", err);

      alert(
        err.response?.data?.message ||
        "Failed to place sell order. Please try again."
      );
    }
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  return (
    <div
      className="container"
      id="buy-window"
      draggable="true"
    >
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) =>
                setStockQuantity(e.target.value)
              }
              value={stockQuantity}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              min="0"
              step="0.05"
              onChange={(e) =>
                setStockPrice(e.target.value)
              }
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>
          Amount ₹
          {(
            Number(stockQuantity) *
            Number(stockPrice)
          ).toFixed(2)}
        </span>

        <div>
          <Link
            className="btn btn-danger"
            onClick={handleSellClick}
          >
            Sell
          </Link>

          <Link
            to=""
            className="btn btn-grey"
            onClick={handleCancelClick}
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;