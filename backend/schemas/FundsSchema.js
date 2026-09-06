const { Schema } = require("mongoose");

const FundsSchema = new Schema({
  balance: {
    type: Number,
    default: 0,
  },
});

module.exports = { FundsSchema };