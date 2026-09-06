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

    // Abhi sirf signup request check kar rahe hain
    // Database mein user save nahi kar rahe
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

    const newOrder = new OrdersModel({
      name: name,
      qty: Number(qty),
      price: Number(price),
      mode: mode,
    });

    await newOrder.save();

    res.status(200).json({
      message: "Order saved successfully",
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