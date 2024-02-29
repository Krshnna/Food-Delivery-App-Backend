import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouters from "./routes/user.routers.js";
import addressRouters from "./routes/address.routers.js";

app.use("/api/v1/users", userRouters);
app.use("/api/v1/addresses", addressRouters);

export default app;
