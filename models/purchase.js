import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false }
);
const purchaseSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cart: [cartItemSchema],
  totalPrice: {
    type: Number,
    min: 0,
  },
  amountPaid: {
    type: Number,
    min: 0,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  purchaseType: {
    type: String,
    enum: ["cash", "loan"],
    required: true,
  },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
