import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  food_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  },
  quantity: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

export const Cart = mongoose.model("Cart", cartSchema);
