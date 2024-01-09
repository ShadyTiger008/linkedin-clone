// const User = require("../models/user.model");
const { uploadOnCloudinary } = require("../services/cloudinary");
const jwt = require("jsonwebtoken");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const userModel = require("../models/user.model");
const { asyncHandler } = require("../utils/asyncHandler");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

//Generate Access and Refresh Token Controller
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await userModel.User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBefore: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token and refresh token"
    );
  }
};

//Refresh Access Token Controller
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingToken) {
      throw new ApiError(401, "Unauthorized Request!");
    }

    const decodedToken = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (incomingToken !== user?.refreshToken) {
      console.log(`Access token is used or expired!`);
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        ApiResponse(
          200,
          { accessToken: accessToken, refreshToken: refreshToken },
          "Access Token refreshed successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token!");
  }
});

//Send verification mail controller
const sendVerificationMail = asyncHandler(async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });

  const mailOptions = {
    from: "linkedin@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email: http://192.168.0.10:8000/verify/${token}`,
  };

  //Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email send successfully!");
  } catch (error) {
    console.log("Error sending the verification email");
  }
});

//Verify Email Controller
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await userModel.User.findOne({ verificationToken: token });
  if (!user) {
    throw new ApiError(404, "Invalid verification token!");
  }

  //Mark the user as verified
  user.isVerified = true;
  user.verificationToken = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { user: user }, "Email Verified successfully!"));
});

//User Registration Controller
const userRegistration = asyncHandler(async (req, res) => {
  const { name, email, password, avatar, coverImage } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await userModel.User.findOne({
    $or: [{ name: name }, { email: email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or name already exists!");
  }
  // const avatarLocalPath = req.files?.avatar[0]?.path;

  // let coverImageLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }
  // // const coverImageLocalPath = req.file.coverImage[ 0 ]?.path

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar is required!");
  // }
  // // console.log("Uploading avatar to Cloudinary:", avatarLocalPath);

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // if (!avatar) {
  //   // console.error("Avatar upload to Cloudinary failed:", avatar);
  //   throw new ApiError(400, "Avatar file is required!");
  // }

  // console.log("Avatar uploaded successfully:", avatar);

  const user = await userModel.User.create({
    name,
    email,
    password,
    avatar: avatar.url || "",
    coverImage: coverImage?.url || "",
  });

  user.verificationToken = crypto.randomBytes(20).toString("hex");

  await user.save();

  sendVerificationMail(user.email, user.verificationToken);

  const createdUser = await userModel.User.findById(user?._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

//User Login Controller
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(403, "Email is required!");
  }

  const user = await userModel.User.findOne({ email: email });

  if (!user) {
    throw new ApiError(403, "User does not exist!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(403, "Password is incorrect!");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
    user._id
  );
  // console.log(refreshToken, accessToken);

  const loggedInUser = await userModel.User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          refreshToken,
          accessToken,
        },
        "User logged in successfully!"
      )
    );
});

// User logout controller
const userLogout = asyncHandler(async (req, res) => {
  await userModel.User.findByIdAndUpdate(
    req.user?._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully!"));
});

module.exports = {
  generateAccessAndRefreshToken,
  refreshAccessToken,
  userRegistration,
  userLogin,
  userLogout,
  verifyEmail,
};
