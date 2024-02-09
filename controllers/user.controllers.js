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
  const user = await User.findOne({
    $or: [{ username:username},{ email:username }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(402, "Invalid password");
  }
  const { accessToken, refreshToken } =await generateAccessAndRefreshToken(user._id);
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

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // check if incoming refresh token is same as the refresh token attached in the user document
    // This shows that the refresh token is used or not
    // Once it is used, we are replacing it with new refresh token below
    if (incomingRefreshToken !== user?.refreshToken) {
      // If token is valid but is used already
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", newRefreshToken)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});
/**
 *
 * @description ResetPassword, change CoverImage and change pic Url controller is left
 */
module.exports = {
  userRegister,
  userLogin,
  userLogout,
  refreshAccessToken
};
