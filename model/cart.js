const { string } = require("joi");
const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);