const cloudinary = require("cloudinary").v2;
const fs = require( "fs" );

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) {
      console.error("No local file path provided");
      return null;
    }

    // Log Cloudinary configuration
    console.log("Cloudinary Configuration:", cloudinary.config());

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been successfully uploaded
    console.log("File is uploaded successfully ", response.url);

    // Remove the locally saved temporary file
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // Handle the error, and remove the locally saved temporary file
    console.error("File upload failed: ", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

module.exports = { uploadOnCloudinary };
