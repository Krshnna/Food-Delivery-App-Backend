import { z } from "zod";
import ApiError from "../utils/ApiError.js";

const validateSchema = (schema) => async (req, res, next) => {
  try {
    const validateData = await schema.parse(req.body);
    req.body = validateData;
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
};

export { validateSchema };
