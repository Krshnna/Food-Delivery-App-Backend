import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  },
});

export const Review = mongoose.model("Review", reviewSchema);
