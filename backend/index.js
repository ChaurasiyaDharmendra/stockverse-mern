// require("dotenv").config();

// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const { HoldingsModel } = require("./model/HoldingsModel");
// const { PositionsModel } = require("./model/PositionsModel");
// const { OrdersModel } = require("./model/OrdersModel");

// const PORT = process.env.PORT || 3002;
// const uri = process.env.MONGO_URL;

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// app.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;

//   console.log("Signup Data ", name, email, password);

//   res.json({
//     message: "Signup successful ",
//   });
// });

// // app.get("/addHoldings", async (req, res) => {
// //   let tempHoldings = [ ... same code ... ]
// // });

// // app.get("/addPositions", async (req, res) => {
// //   let tempPositions = [ ... same code ... ]
// // });

// app.get("/allHoldings", async (req, res) => {
//   let allHoldings = await HoldingsModel.find({});
//   res.json(allHoldings);
// });

// app.get("/allPositions", async (req, res) => {
//   let allPositions = await PositionsModel.find({});
//   res.json(allPositions);
// });

// app.post("/newOrder", async (req, res) => {
//   let newOrder = new OrdersModel({
//     name: req.body.name,
//     qty: req.body.qty,
//     price: req.body.price,
//     mode: req.body.mode,
//   });

//   await newOrder.save();

//   res.send("Order saved!");
// });

// app.get("/getOrders", async (req, res) => {
//   let allOrders = await OrdersModel.find({});
//   res.json(allOrders);
// });

// app.listen(PORT, () => {
//   console.log("App started!");

//   mongoose.connect(uri);

//   console.log("DB started!");
// });

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Signup Data", name, email, password);

  res.json({
    message: "Signup successful",
  });
});

// Get all holdings
app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching holdings" });
  }
});

// Get all positions
app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching positions" });
  }
});

// Create new order + update holdings
app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    const quantity = Number(qty);
    const orderPrice = Number(price);

    // Save order
    const newOrder = new OrdersModel({
      name: name,
      qty: quantity,
      price: orderPrice,
      mode: mode,
    });

    await newOrder.save();

    // Find existing holding
    const holding = await HoldingsModel.findOne({ name: name });

    if (holding) {
      // BUY
      if (mode === "BUY") {
        holding.qty = holding.qty + quantity;

        // Update average price
        holding.avg =
          ((holding.avg * (holding.qty - quantity)) +
            (orderPrice * quantity)) /
          holding.qty;

        await holding.save();
      }

      // SELL
      if (mode === "SELL") {
        holding.qty = holding.qty - quantity;

        // If quantity becomes 0 or less, remove holding
        if (holding.qty <= 0) {
          await HoldingsModel.deleteOne({ _id: holding._id });
        } else {
          await holding.save();
        }
      }
    } else {
      // If stock is not already in holdings
      // Create holding only when buying
      if (mode === "BUY") {
        const newHolding = new HoldingsModel({
          name: name,
          qty: quantity,
          avg: orderPrice,
          price: orderPrice,
          net: "0%",
          day: "0%",
        });

        await newHolding.save();
      }
    }

    res.json({
      message: "Order saved and holdings updated",
    });
  } catch (error) {
    console.log("Order Error:", error);

    res.status(500).json({
      message: "Order failed",
    });
  }
});

// Get all orders
app.get("/getOrders", async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({});
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log("App started!");

  mongoose
    .connect(uri)
    .then(() => {
      console.log("DB started!");
    })
    .catch((error) => {
      console.log("MongoDB connection error:", error);
    });
});