import mongoose from "mongoose";
import {DB_NAME} from "../constant.js";

const connectDB = async () => {
  await mongoose
    .connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    .then((con) => console.log(`Database connected: ${con.connection.host}`))
    .catch((err) => console.log(err));
};

export default connectDB;