import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  },
  rating: {
    type: Number,
    default: 0,
  },
});
export const Rating = mongoose.model("Rating", ratingSchema);