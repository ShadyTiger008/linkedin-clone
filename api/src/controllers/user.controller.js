// const User = require("../models/user.model");
const { uploadOnCloudinary } = require("../services/cloudinary");
const jwt = require("jsonwebtoken");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const userModel = require("../models/user.model");
const { asyncHandler } = require("../utils/asyncHandler");

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

//User Registration Controller
const userRegistration = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await userModel.User.findOne({
    $or: [{ name: name }, { email: email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or name already exists!");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  // const coverImageLocalPath = req.file.coverImage[ 0 ]?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required!");
  }
  // console.log("Uploading avatar to Cloudinary:", avatarLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    // console.error("Avatar upload to Cloudinary failed:", avatar);
    throw new ApiError(400, "Avatar file is required!");
  }

  // console.log("Avatar uploaded successfully:", avatar);

  const user = await userModel.User.create({
    name,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

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
  const { username, email, password } = req.body;
  // console.log(req.body);
  if (!username && !email) {
    throw new ApiError(403, "username or email is required!");
  }

  const user = await userModel.User.findOne({
    $or: [{ username: username }, { email: email }],
  });

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
};
