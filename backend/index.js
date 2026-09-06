require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { FundsModel } = require("./model/FundsModel");

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

// ==================== GET FUNDS ====================

app.get("/funds", async (req, res) => {
  try {
    let funds = await FundsModel.findOne({});

    if (!funds) {
      funds = new FundsModel({
        balance: 0,
      });

      await funds.save();
    }

    res.json({
      balance: Number(funds.balance),
    });
  } catch (error) {
    console.log("Funds Error:", error);

    res.status(500).json({
      message: "Error fetching funds",
    });
  }
});

// ==================== ADD FUNDS ====================

app.post("/addFunds", async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Enter a valid amount",
      });
    }

    let funds = await FundsModel.findOne({});

    if (!funds) {
      funds = new FundsModel({
        balance: 0,
      });
    }

    funds.balance = Number(funds.balance) + amount;

    await funds.save();

    res.status(200).json({
      message: `₹${amount.toFixed(2)} added successfully`,
      balance: Number(funds.balance),
    });
  } catch (error) {
    console.log("Add Funds Error:", error);

    res.status(500).json({
      message: "Unable to add funds",
    });
  }
});

// ==================== WITHDRAW FUNDS ====================

app.post("/withdrawFunds", async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Enter a valid amount",
      });
    }

    const funds = await FundsModel.findOne({});

    if (!funds || Number(funds.balance) < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    funds.balance = Number(funds.balance) - amount;

    await funds.save();

    res.status(200).json({
      message: `₹${amount.toFixed(2)} withdrawn successfully`,
      balance: Number(funds.balance),
    });
  } catch (error) {
    console.log("Withdraw Error:", error);

    res.status(500).json({
      message: "Unable to withdraw funds",
    });
  }
});

// ==================== NEW ORDER ====================

app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    const quantity = Number(qty);
    const stockPrice = Number(price);

    // ---------- VALIDATION ----------

    if (
      !name ||
      !quantity ||
      quantity <= 0 ||
      !stockPrice ||
      stockPrice <= 0 ||
      !mode
    ) {
      return res.status(400).json({
        message: "Invalid order details",
      });
    }

    if (mode !== "BUY" && mode !== "SELL") {
      return res.status(400).json({
        message: "Invalid order mode",
      });
    }

    const totalAmount = stockPrice * quantity;

    // =====================================================
    // BUY
    // =====================================================

    if (mode === "BUY") {
      // ---------- CHECK BALANCE ----------

      let funds = await FundsModel.findOne({});

      if (!funds) {
        funds = new FundsModel({
          balance: 0,
        });

        await funds.save();
      }

      const currentBalance = Number(funds.balance);

      // ---------- INSUFFICIENT BALANCE ----------

      if (currentBalance < totalAmount) {
        return res.status(400).json({
          message: `Insufficient balance. Please add funds first. Required: ₹${totalAmount.toFixed(
            2
          )}, Available: ₹${currentBalance.toFixed(2)}`,
        });
      }

      // =====================================================
      // HOLDINGS
      // =====================================================

      const existingHolding = await HoldingsModel.findOne({
        name: name,
      });

      if (existingHolding) {
        const oldQty = Number(existingHolding.qty);
        const oldAvg = Number(existingHolding.avg);

        const newQty = oldQty + quantity;

        const newAvg =
          (oldAvg * oldQty + stockPrice * quantity) / newQty;

        existingHolding.qty = newQty;
        existingHolding.avg = newAvg;
        existingHolding.price = stockPrice;

        await existingHolding.save();
      } else {
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

      // =====================================================
      // POSITIONS
      // =====================================================

      const existingPosition = await PositionsModel.findOne({
        name: name,
      });

      if (existingPosition) {
        const oldQty = Number(existingPosition.qty);
        const oldAvg = Number(existingPosition.avg);

        const newQty = oldQty + quantity;

        const newAvg =
          (oldAvg * oldQty + stockPrice * quantity) / newQty;

        existingPosition.qty = newQty;
        existingPosition.avg = newAvg;
        existingPosition.price = stockPrice;

        const pnl = (stockPrice - newAvg) * newQty;

        existingPosition.isLoss = pnl < 0;

        await existingPosition.save();
      } else {
        const newPosition = new PositionsModel({
          product: "CNC",
          name: name,
          qty: quantity,
          avg: stockPrice,
          price: stockPrice,
          net: "0.00%",
          day: "0.00%",
          isLoss: false,
        });

        await newPosition.save();
      }

      // =====================================================
      // CUT BUY AMOUNT FROM FUNDS
      // =====================================================

      funds.balance = currentBalance - totalAmount;

      await funds.save();
    }

    // =====================================================
    // SELL
    // =====================================================

    if (mode === "SELL") {
      // ---------- HOLDINGS CHECK ----------

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

      // =====================================================
      // UPDATE HOLDINGS
      // =====================================================

      const newQty = oldQty - quantity;

      existingHolding.price = stockPrice;

      if (newQty === 0) {
        await HoldingsModel.deleteOne({
          _id: existingHolding._id,
        });
      } else {
        existingHolding.qty = newQty;

        await existingHolding.save();
      }

      // =====================================================
      // UPDATE POSITIONS
      // =====================================================

      const existingPosition = await PositionsModel.findOne({
        name: name,
      });

      if (existingPosition) {
        const oldPositionQty = Number(existingPosition.qty);

        const newPositionQty =
          oldPositionQty - quantity;

        if (newPositionQty <= 0) {
          await PositionsModel.deleteOne({
            _id: existingPosition._id,
          });
        } else {
          existingPosition.qty = newPositionQty;
          existingPosition.price = stockPrice;

          const pnl =
            (stockPrice - Number(existingPosition.avg)) *
            newPositionQty;

          existingPosition.isLoss = pnl < 0;

          await existingPosition.save();
        }
      }

      // =====================================================
      // ADD SELL AMOUNT TO FUNDS
      // =====================================================

      let funds = await FundsModel.findOne({});

      if (!funds) {
        funds = new FundsModel({
          balance: 0,
        });
      }

      funds.balance =
        Number(funds.balance) + totalAmount;

      await funds.save();
    }

    // =====================================================
    // SAVE ORDER
    // =====================================================

    const newOrder = new OrdersModel({
      name: name,
      qty: quantity,
      price: stockPrice,
      mode: mode,
    });

    await newOrder.save();

    // =====================================================
    // RESPONSE
    // =====================================================

    const updatedFunds = await FundsModel.findOne({});

    res.status(200).json({
      message: `${mode} order placed successfully`,
      balance: updatedFunds
        ? Number(updatedFunds.balance)
        : 0,
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