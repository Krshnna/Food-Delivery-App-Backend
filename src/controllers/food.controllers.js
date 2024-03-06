import mongoose, { isValidObjectId } from "mongoose";
import { Category } from "../models/category.models.js";
import { Food } from "../models/food.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadImageOnCloudinary } from "../utils/cloudinary.js";

const addFoodItem = asyncHandler(async (req, res) => {
  const { name, price, isAvailable, description, category } = req.body;
  if (
    [name, price, isAvailable, description, category].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const imageFile = req.file?.path;
  if (!imageFile) {
    throw new ApiError(400, "Image is required");
  }
  const image = await uploadImageOnCloudinary(imageFile);
  if (!image) {
    throw new ApiError(400, "Error while Uploading on Cloudinary!!!");
  }
  const checkCatExists = await Category.findOne({
    name: category.toLowerCase(),
  });
  if (!checkCatExists) {
    throw new ApiError(400, "Category does not exists");
  }
  const createFood = await Food.create({
    name: name.toUpperCase(),
    price,
    isAvailable,
    image: image?.url,
    description,
    category: checkCatExists._id,
  });
  if (!createFood) {
    throw new ApiError(400, "Error while creating food item");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createFood, "Item Created Successfully!!!"));
});

const getAllFood = asyncHandler(async (req, res) => {
  const food = await Food.find();

  if (!food) {
    throw new ApiError(400, "No Items available right now.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, food, "Items fetched successfully"));
});

const getFoodById = asyncHandler(async (req, res) => {
  const { foodId } = req.params;
  if (!isValidObjectId(foodId)) {
    throw new ApiError(400, "Invalid Food Id");
  }
  const food = await Food.findById(foodId);

  if (!food) {
    throw new ApiError(400, "No food item found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, food, "Food Item fetched successfully"));
});

const toggleItemAvailability = asyncHandler(async (req, res) => {
  const { foodId } = req.params;
  if (!isValidObjectId(foodId)) {
    throw new ApiError(400, "Invalid Food Id");
  }
  let findItem = await Food.findById(foodId);
  if (!findItem) {
    throw new ApiError(400, "No food item found");
  }

  const available = findItem.isAvailable;
  findItem.isAvailable = !available;

  await findItem.save();

  return res
    .status(200)
    .json(new ApiResponse(200, findItem, "Toogling Successfull!!!"));
});

const getItemByCategory = asyncHandler(async (req, res) => {});

const filterFoodByTopRatings = asyncHandler(async (req, res) => {});

export {
  addFoodItem,
  getAllFood,
  getFoodById,
  toggleItemAvailability,
  getItemByCategory,
};
