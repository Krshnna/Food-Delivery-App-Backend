import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {
  deleteImageOnCloudinary,
  uploadImageOnCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, userName, email, password, phone } = req.body;
  if (
    [fullName, userName, email, password, phone].some(
      (fields) => fields?.trim === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const isUserExisted = await User.findOne({
    $or: [{ email }, { userName }, { phone }],
  });
  if (isUserExisted) {
    throw new ApiError(400, "User already exists");
  }

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadImageOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    password,
    email,
    phone,
    avatar: avatar.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(400, "Something went wrong. Please try again!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered SuccessFully!!!"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { userNameOrEmail, password } = req.body;

  const findUser = await User.findOne({
    $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
  });

  if (!findUser) {
    throw new ApiError(400, "User Not Found!!!");
  }
  const isPasswordValid = await findUser.matchPassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials. Please try again!!!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    findUser._id
  );

  const loggedIn = await User.findById(findUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedIn,
          accessToken,
          refreshToken,
        },
        "User  Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(400, {}, "Logout SuccessFully!!!"));
});

const renewRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = await jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decoded?._id);
  if (!user) {
    throw new ApiError(400, "Invalid Refresh Token!!!");
  }
  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(400, "Refresh Token is used or invalid!!!");
  }

  //Generate a new access token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access Token refreshed!!!"
      )
    );
});

const updateDetails = asyncHandler(async (req, res) => {
  const { fullName, phone, userName, email } = req.body;
  const details = {};

  if (
    [fullName, phone, userName, email].some((fields) => fields?.trim() === "")
  ) {
    throw new ApiError(400, "Atleast one field is required!!!");
  }

  if (fullName) details.fullName = fullName;
  if (phone) details.phone = phone;
  if (userName) details.userName = userName.toLowerCase();
  if (email) details.email = email;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: details,
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Details Updated SuccessFully!!!"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarFile = req.file?.path;
  if (!avatarFile) {
    throw new ApiError(400, "Image is required!!!");
  }
  const avatar = await uploadImageOnCloudinary(avatarFile);
  if (!avatar) {
    throw new ApiError(400, "Error while uploading on cloudinary!!!");
  }
  const oldAvatar = req.user.avatar;
  const deleteOldUrl = await deleteImageOnCloudinary(oldAvatar);
  if (!deleteOldUrl) {
    throw new ApiError(400, "Error while deleting from cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Updated SuccessFully!!!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User Fetched SuccessFully!!!"));
});

export {
  generateAccessAndRefreshToken,
  registerUser,
  loginUser,
  logoutUser,
  renewRefreshToken,
  updateDetails,
  updateAvatar,
  getCurrentUser,
};
