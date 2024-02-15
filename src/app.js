import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";

dotenv.config();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


export default app;
