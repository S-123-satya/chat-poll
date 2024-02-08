const  User = require("../models/user.model.js")
const { ApiError } = require("../utils/ApiError.js");
const { asyncHandler } = require("../utils/AsyncHandler.js");
const jwt = require("jsonwebtoken");

module.exports.verifyJWT = asyncHandler(async (req, res, next) => {
  let user=null;
  const token =
    req.cookies?.accessToken ||
    req.header("Autherization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decodedToken) {
    throw new ApiError(401, "Unautorized access, token missing");
  }
   user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(404, "Unauthorized access User not found or token get expired plesase use refresh token to generate access token again");
  }
  req.user=user;
  next();
});

