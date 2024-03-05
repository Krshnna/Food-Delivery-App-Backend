import express from "express";
import {
  addCategory,
  getAllCategories,
  searchCategory,
} from "../controllers/category.controllers.js";
import isAuthenticated from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = express.Router();

router
  .route("/add-category")
  .post(isAuthenticated, upload.single("categoryImageFile"), addCategory);

router.route("/fetch-category").get(isAuthenticated, searchCategory);
router.route("/get-all-category").get(isAuthenticated, getAllCategories);

export default router;
