const Option = require("../models/option.model.js");
const User = require("../models/user.model.js");
const { ApiError } = require("./ApiError.js");
module.exports.generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    console.log(`access helper token`, accessToken);
    console.log(`refresh helper token`, refreshToken);
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access and refresh token",
      error
    );
  }
};

module.exports.searchExistedUser = async (pollId, userId) => {
  try {
    const response=await Option.aggregate([
      { $match: { pollId: pollId } },
      {
        $match: { votedBy: userId },
      },
    ]);
    console.log(response);
    return response;
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};
