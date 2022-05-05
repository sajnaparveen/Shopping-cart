
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {  
    userUuid: { type: String, required: true },
    products: [
      {
        productUuid: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);