import express from "express";
import {
  createAddress,
  updateAddress,
} from "../controllers/address.controllers.js";
import isAuthenticated from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.route("/add-address/:id").post(isAuthenticated, createAddress);
router.route("/update-address").put(isAuthenticated, updateAddress);

export default router;
