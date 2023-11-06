import cloudinaryPackage from "cloudinary";

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

//configure cloudinary with a specific version(v2)
const cloudinary = cloudinaryPackage.v2; 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

// Create storage engine for Multer -> This is used to upload file in cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png","jpeg"],
  params: {
    folder: "backend",
  },
});

// Init Multer with the storage engine -> Used to receive the file the user is uploading
const upload = multer({storage });

export default upload;
