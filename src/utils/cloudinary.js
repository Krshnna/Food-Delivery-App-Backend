import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINART_API_SECRET,
});

const uploadImage = async (localPath) => {
  try {
    if (!localPath) return null;
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localPath);
    return response;
  } catch (error) {
    fs.unlinkSync(localPath);
    return null;
  }
};

const deleteImage = async (public_id, resource_type = "image") => {
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
