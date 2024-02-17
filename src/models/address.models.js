import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: new mongoose.Schema.Types.ObjectId(),
    ref: "User",
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
});

export const Address = mongoose.model("Address", addressSchema);
