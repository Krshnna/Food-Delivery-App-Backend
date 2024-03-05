import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  categoryImage: {
    type: String,
    required: true,
  },
});
categorySchema.plugin(mongooseAggregatePaginate);

export const Category = mongoose.model("Category", categorySchema);
