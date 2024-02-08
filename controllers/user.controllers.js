const { asyncHandler } = require("./../utils/AsyncHandler.js");
const { ApiResponse } = require("./../utils/ApiResponse.js");
const User = require("../models/user.model.js");
const { ApiError } = require("../utils/ApiError.js");
const { generateAccessAndRefreshToken } = require("../utils/helpers.js");

const userRegister = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  // picUrl and coverImage is not done yet we have to do it also
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(
      401,
      "username or email is already exist, try with something new username and email or login with existing creaditials"
    );
  }
  const userObj = {
    username,
    email,
    password,
    // picUrl and coverImage is not done yet we need to do it as well
  };
  const user = await User.create(userObj);
  if (!user) {
    throw new ApiError(500, "something went wrong");
  }
  const { accessToken, refreshToken } =await generateAccessAndRefreshToken(user._id);
  console.log(accessToken);
  console.log(refreshToken);
  const newUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  res
    .status(201)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(
      new ApiResponse(201, "User registered successfully", {
        user: newUser,
        accessToken,
        refreshToken,
      })
    );
});

const userLogin = asyncHandler(async (req, res, next) => {
  const { username,  password } = req.body;
  console.log(username);
  const user = await User.findOne({
    $or: [{ username:username},{ email:username }],
  });
  console.log(user);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(402, "Invalid password");
  }
  const { accessToken, refreshToken } =await generateAccessAndRefreshToken(user._id);
  console.log(`access token`);
  console.log(accessToken);
  console.log(refreshToken);
  const newUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(
      new ApiResponse(200, "User login successfully", {
        user: newUser,
        accessToken:accessToken,
        refreshToken,
      })
    );
});

const userLogout = asyncHandler(async (req, res, next) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json(new ApiResponse(200, "Logout successfully", {}));
});


/**
 *
 * @description ResetPassword, change CoverImage and change pic Url controller is left
 */
module.exports = {
  userRegister,
  userLogin,
  userLogout,
};
