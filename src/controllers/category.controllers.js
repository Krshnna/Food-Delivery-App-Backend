import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Category } from "../models/category.models.js";
import { uploadImageOnCloudinary } from "../utils/cloudinary.js";

const addCategory = asyncHandler(async (req, res) => {
  let { categoryName } = req.body;
  if (!categoryName) {
    throw new ApiError(400, "Category name is required");
  }

  const categoryImageFile = req.file?.path;
  if (!categoryImageFile) {
    throw new ApiError(400, "Category Image File is required");
  }

  const avatar = await uploadImageOnCloudinary(categoryImageFile);
  if (!avatar) {
    throw new ApiError(400, "Error uploading image on cloudinary");
  }

  categoryName = categoryName.toLowerCase();

  const category = await Category.findOne({ name: categoryName });
  if (category) {
    throw new ApiError(400, "Category already exists");
  }

  const newCategory = await Category.create({
    name: categoryName,
    categoryImage: avatar.url,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newCategory, "Category created successfully"));
});

const searchCategory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortBy = "asc", query, sortType } = req.query;
  let sortOptions = {};

  if (sortBy === "asc") sortOptions[sortBy] = 1;
  else sortOptions[sortBy] = -1;

  if (!query || !sortType) {
    throw new ApiError(400, "Category type is required");
  }
  const category = await Category.find({
    name: { $regex: query, $options: "i" },
  }).sort(sortOptions);
  if (category.length === 0) {
    throw new ApiError(400, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  if (!categories) {
    throw new ApiError(400, "No categories found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

export { addCategory, searchCategory, getAllCategories };
