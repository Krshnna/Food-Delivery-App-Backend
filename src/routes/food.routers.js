import express from "express";
import isAuthenticated from "../middlewares/auth.middlewares.js";
import {
  addFoodItem,
  getAllFood,
  getFoodById,
  getItemByCategory,
  toggleItemAvailability,
} from "../controllers/food.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

router
  .route("/add-item")
  .post(upload.single("imageFile"), isAuthenticated, addFoodItem);
router.route("/getAllFood").get(isAuthenticated, getAllFood);
router.route("/getFoodById/:foodId").get(isAuthenticated, getFoodById);
router
  .route("/toggle-item-availability/:foodId")
  .post(isAuthenticated, toggleItemAvailability);
router
  .route("/getItemByCategory/:categoryId")
  .get(isAuthenticated, getItemByCategory);

export default router;
