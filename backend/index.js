// // require("dotenv").config();

// // const express = require("express");
// // const mongoose = require("mongoose");
// // const bodyParser = require("body-parser");
// // const cors = require("cors");

// // const { HoldingsModel } = require("./model/HoldingsModel");
// // const { PositionsModel } = require("./model/PositionsModel");
// // const { OrdersModel } = require("./model/OrdersModel");

// // const PORT = process.env.PORT || 3002;
// // const uri = process.env.MONGO_URL;

// // const app = express();

// // app.use(cors());
// // app.use(bodyParser.json());

// // app.post("/signup", async (req, res) => {
// //   const { name, email, password } = req.body;

// //   console.log("Signup Data ", name, email, password);

// //   res.json({
// //     message: "Signup successful ",
// //   });
// // });

// // // app.get("/addHoldings", async (req, res) => {
// // //   let tempHoldings = [ ... same code ... ]
// // // });

// // // app.get("/addPositions", async (req, res) => {
// // //   let tempPositions = [ ... same code ... ]
// // // });

// // app.get("/allHoldings", async (req, res) => {
// //   let allHoldings = await HoldingsModel.find({});
// //   res.json(allHoldings);
// // });

// // app.get("/allPositions", async (req, res) => {
// //   let allPositions = await PositionsModel.find({});
// //   res.json(allPositions);
// // });

// // app.post("/newOrder", async (req, res) => {
// //   let newOrder = new OrdersModel({
// //     name: req.body.name,
// //     qty: req.body.qty,
// //     price: req.body.price,
// //     mode: req.body.mode,
// //   });

// //   await newOrder.save();

// //   res.send("Order saved!");
// // });

// // app.get("/getOrders", async (req, res) => {
// //   let allOrders = await OrdersModel.find({});
// //   res.json(allOrders);
// // });

// // app.listen(PORT, () => {
// //   console.log("App started!");

// //   mongoose.connect(uri);

// //   console.log("DB started!");
// // });

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

// // Signup
// app.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;

//   console.log("Signup Data", name, email, password);

//   res.json({
//     message: "Signup successful",
//   });
// });

// // Get all holdings
// app.get("/allHoldings", async (req, res) => {
//   try {
//     const allHoldings = await HoldingsModel.find({});
//     res.json(allHoldings);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching holdings" });
//   }
// });

// // Get all positions
// app.get("/allPositions", async (req, res) => {
//   try {
//     const allPositions = await PositionsModel.find({});
//     res.json(allPositions);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching positions" });
//   }
// });

// // Create new order + update holdings
// app.post("/newOrder", async (req, res) => {
//   try {
//     const { name, qty, price, mode } = req.body;

//     const quantity = Number(qty);
//     const orderPrice = Number(price);

//     // Save order
//     const newOrder = new OrdersModel({
//       name: name,
//       qty: quantity,
//       price: orderPrice,
//       mode: mode,
//     });

//     await newOrder.save();

//     // Find existing holding
//     const holding = await HoldingsModel.findOne({ name: name });

//     if (holding) {
//       // BUY
//       if (mode === "BUY") {
//         holding.qty = holding.qty + quantity;

//         // Update average price
//         holding.avg =
//           ((holding.avg * (holding.qty - quantity)) +
//             (orderPrice * quantity)) /
//           holding.qty;

//         await holding.save();
//       }

//       // SELL
//       if (mode === "SELL") {
//         holding.qty = holding.qty - quantity;

//         // If quantity becomes 0 or less, remove holding
//         if (holding.qty <= 0) {
//           await HoldingsModel.deleteOne({ _id: holding._id });
//         } else {
//           await holding.save();
//         }
//       }
//     } else {
//       // If stock is not already in holdings
//       // Create holding only when buying
//       if (mode === "BUY") {
//         const newHolding = new HoldingsModel({
//           name: name,
//           qty: quantity,
//           avg: orderPrice,
//           price: orderPrice,
//           net: "0%",
//           day: "0%",
//         });

//         await newHolding.save();
//       }
//     }

//     res.json({
//       message: "Order saved and holdings updated",
//     });
//   } catch (error) {
//     console.log("Order Error:", error);

//     res.status(500).json({
//       message: "Order failed",
//     });
//   }
// });

// // Get all orders
// app.get("/getOrders", async (req, res) => {
//   try {
//     const allOrders = await OrdersModel.find({});
//     res.json(allOrders);
//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching orders",
//     });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log("App started!");

//   mongoose
//     .connect(uri)
//     .then(() => {
//       console.log("DB started!");
//     })
//     .catch((error) => {
//       console.log("MongoDB connection error:", error);
//     });
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

// app.get("/addHoldings", async (req, res) => {
//   let tempHoldings = [
//     {
//       name: "BHARTIARTL",
//       qty: 2,
//       avg: 538.05,
//       price: 541.15,
//       net: "+0.58%",
//       day: "+2.99%",
//     },
//     {
//       name: "HDFCBANK",
//       qty: 2,
//       avg: 1383.4,
//       price: 1522.35,
//       net: "+10.04%",
//       day: "+0.11%",
//     },
//     {
//       name: "HINDUNILVR",
//       qty: 1,
//       avg: 2335.85,
//       price: 2417.4,
//       net: "+3.49%",
//       day: "+0.21%",
//     },
//     {
//       name: "INFY",
//       qty: 1,
//       avg: 1350.5,
//       price: 1555.45,
//       net: "+15.18%",
//       day: "-1.60%",
//       isLoss: true,
//     },
//     {
//       name: "ITC",
//       qty: 5,
//       avg: 202.0,
//       price: 207.9,
//       net: "+2.92%",
//       day: "+0.80%",
//     },
//     {
//       name: "KPITTECH",
//       qty: 5,
//       avg: 250.3,
//       price: 266.45,
//       net: "+6.45%",
//       day: "+3.54%",
//     },
//     {
//       name: "M&M",
//       qty: 2,
//       avg: 809.9,
//       price: 779.8,
//       net: "-3.72%",
//       day: "-0.01%",
//       isLoss: true,
//     },
//     {
//       name: "RELIANCE",
//       qty: 1,
//       avg: 2193.7,
//       price: 2112.4,
//       net: "-3.71%",
//       day: "+1.44%",
//     },
//     {
//       name: "SBIN",
//       qty: 4,
//       avg: 324.35,
//       price: 430.2,
//       net: "+32.63%",
//       day: "-0.34%",
//       isLoss: true,
//     },
//     {
//       name: "SGBMAY29",
//       qty: 2,
//       avg: 4727.0,
//       price: 4719.0,
//       net: "-0.17%",
//       day: "+0.15%",
//     },
//     {
//       name: "TATAPOWER",
//       qty: 5,
//       avg: 104.2,
//       price: 124.15,
//       net: "+19.15%",
//       day: "-0.24%",
//       isLoss: true,
//     },
//     {
//       name: "TCS",
//       qty: 1,
//       avg: 3041.7,
//       price: 3194.8,
//       net: "+5.03%",
//       day: "-0.25%",
//       isLoss: true,
//     },
//     {
//       name: "WIPRO",
//       qty: 4,
//       avg: 489.3,
//       price: 577.75,
//       net: "+18.08%",
//       day: "+0.32%",
//     },
//   ];

//   tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel({
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.day,
//       day: item.day,
//     });

//     newHolding.save();
//   });
//   res.send("Done!");
// });

// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });

//     newPosition.save();
//   });
//   res.send("Done!");
// });

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post("/newOrder", async (req, res) => {
  let newOrder = new OrdersModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });

  newOrder.save();

  res.send("Order saved!");
});

app.listen(PORT, () => {
  console.log("App started!");
  mongoose.connect(uri);
  console.log("DB started!");
});