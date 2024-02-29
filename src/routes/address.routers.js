import express from "express";
import { createAddress } from "../controllers/address.controllers.js";
import isAuthenticated from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.route("/add-address/:id").post(isAuthenticated, createAddress);

export default router;
