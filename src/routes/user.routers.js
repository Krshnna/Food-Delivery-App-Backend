import express from "express";
import isAuthenticated from "../middlewares/auth.middlewares.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  renewRefreshToken,
  updateAvatar,
  updateDetails,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { registerSchemaValidation } from "../utils/validation.js";
import { validateSchema } from "../middlewares/validate.middlewares.js";

const router = express.Router();

router
  .route("/register-user")
  .post(
    upload.single("avatar"),
    validateSchema(registerSchemaValidation),
    registerUser
  );
router.route("/login").post(loginUser);
router.route("/logout").post(isAuthenticated, logoutUser);
router.route("/refresh-token").post(isAuthenticated, renewRefreshToken);
router.route("/update-details").patch(isAuthenticated, updateDetails);
router.route("/update-avatar").patch(isAuthenticated, updateAvatar);

export default router;
