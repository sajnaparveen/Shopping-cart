const { string } = require("joi");
const mongoose = require("mongoose");

// const CartSchema = new mongoose.Schema(
//   {
   
//     userUuid: { type: String, required: true },
//     products: [
//       {
//         // _id:{type:mongoose.Schema.Types.ObjectId,ref:"product"},
//         productUuid: {
//           type: String,
//         },
//         quantity: {
//           type: Number,
//           default: 1,
//         },
//       },
//     ],
//     amount: { type: Number, required: true },
//     address: { type: Object, required: true },
//     status: { type: String, default: "pending" },
//     totalPrice:{type:Number,required:false},
//   },
//   { timestamps: true }
// );
const CartSchema = new mongoose.Schema(
  {
     userUuid: { type: String, required: true },
    products: [
      {
        productUuid: String,
        quantity: Number,
        name: String,
        price: Number
      }
    ],
    active: {
      type: Boolean,
      default: true
    },
    modifiedOn: {
      type: Date,
      default: Date.now
    },
    total : {type : Number, required: false, default :0 }
  },

  { timestamps: true }
);
module.exports = mongoose.model("Cart", CartSchema);