const { ApiError } = require( '../utils/ApiError' );
const jwt = require( 'jsonwebtoken' );
const { asyncHandler } = require( '../utils/asyncHandler' );
const { User } = require( '../models/user.model' );

const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(409, "Unauthorized request!");
    }

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token!");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
} );

module.exports = {verifyJwt}