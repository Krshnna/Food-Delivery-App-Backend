import mongoose, { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Address } from "../models/address.models.js";

const createAddress = asyncHandler(async (req, res) => {
  console.log(req.params);
  const { state, city, pincode, street } = req.body;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  if ([state, city, pincode, street].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "Please fill all the fields");
  }

  const address = await Address.create({
    userId,
    state,
    pincode,
    street,
    city,
  });
  if (!address) {
    throw new ApiError(400, "Address not created");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address added successfully!!!"));
});

export { createAddress };
