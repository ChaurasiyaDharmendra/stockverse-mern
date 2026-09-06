require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(express.json());


// ==================== SIGNUP ====================

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Signup Data:", name, email);

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    res.status(200).json({
      message: "Signup successful",
    });
  } catch (error) {
    console.log("Signup Error:", error);

    res.status(500).json({
      message: "Signup failed",
    });
  }
});


// ==================== HOLDINGS ====================

app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});

    res.json(allHoldings);
  } catch (error) {
    console.log("Holdings Error:", error);

    res.status(500).json({
      message: "Error fetching holdings",
    });
  }
});


// ==================== POSITIONS ====================

app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});

    res.json(allPositions);
  } catch (error) {
    console.log("Positions Error:", error);

    res.status(500).json({
      message: "Error fetching positions",
    });
  }
});


// ==================== NEW ORDER ====================

app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    const quantity = Number(qty);
    const stockPrice = Number(price);

    if (!name || !quantity || !stockPrice || !mode) {
      return res.status(400).json({
        message: "Invalid order details",
      });
    }

    // ==================== BUY ====================

    if (mode === "BUY") {
      const existingHolding = await HoldingsModel.findOne({
        name: name,
      });

      if (existingHolding) {
        // Existing quantity
        const oldQty = Number(existingHolding.qty);

        // Existing average price
        const oldAvg = Number(existingHolding.avg);

        // New total quantity
        const newQty = oldQty + quantity;

        // Calculate new average price
        const newAvg =
          (oldAvg * oldQty + stockPrice * quantity) / newQty;

        existingHolding.qty = newQty;
        existingHolding.avg = newAvg;
        existingHolding.price = stockPrice;

        await existingHolding.save();
      } else {
        // Create new holding
        const newHolding = new HoldingsModel({
          name: name,
          qty: quantity,
          avg: stockPrice,
          price: stockPrice,
          net: "0.00%",
          day: "0.00%",
        });

        await newHolding.save();
      }
    }


    // ==================== SELL ====================

    if (mode === "SELL") {
      const existingHolding = await HoldingsModel.findOne({
        name: name,
      });

      if (!existingHolding) {
        return res.status(400).json({
          message: "You don't have this stock in holdings",
        });
      }

      const oldQty = Number(existingHolding.qty);

      if (quantity > oldQty) {
        return res.status(400).json({
          message: `You only have ${oldQty} shares of ${name}`,
        });
      }

      const newQty = oldQty - quantity;

      // Update current price
      existingHolding.price = stockPrice;

      if (newQty === 0) {
        // If all shares are sold, remove holding
        await HoldingsModel.deleteOne({
          _id: existingHolding._id,
        });
      } else {
        existingHolding.qty = newQty;

        await existingHolding.save();
      }
    }


    // ==================== SAVE ORDER ====================

    const newOrder = new OrdersModel({
      name: name,
      qty: quantity,
      price: stockPrice,
      mode: mode,
    });

    await newOrder.save();

    res.status(200).json({
      message: `${mode} order placed successfully`,
    });

  } catch (error) {
    console.log("Order Error:", error);

    res.status(500).json({
      message: "Order failed",
    });
  }
});


// ==================== GET ORDERS ====================

app.get("/getOrders", async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({});

    res.json(allOrders);
  } catch (error) {
    console.log("Orders Error:", error);

    res.status(500).json({
      message: "Error fetching orders",
    });
  }
});


// ==================== START SERVER ====================

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });