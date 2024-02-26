import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageOnCloudinary = async (
  localFilePath,
  resource_type = "image"
) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type,
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteImageOnCloudinary = async (public_id, resource_type = "image") => {
  try {
    if (!public_id) return null;
    const response = await cloudinary.uploader.destroy(public_id, {
      resource_type,
    });
    return response;
  } catch (error) {
    return null;
  }
};

export { uploadImageOnCloudinary, deleteImageOnCloudinary };
