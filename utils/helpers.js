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
    console.log(`line 25 in search existed user poll`, pollId, userId);
    const response = await Option.find({ pollId: pollId }).select(
      "_id votedBy"
    );
    let len = response.length;
    let existingOption = null;
    console.log(len, `length 30`);
    for (let i = 0; i < len; i++) {
      if(existingOption) break;
      console.log(response[i].votedBy.length);
      for (let j = 0; j < response[i].votedBy.length; j++) {
        console.log(response[i].votedBy[j], "line 33");
        console.log(userId, "34");
        // const compare3 = String(user._id) === String(address.userId)
        if (String(response[i].votedBy[j]) == String(userId)) {
          existingOption = await Option.findById(response[i]._id);
          console.log(`user already voted to someone else`);
          break;
        }
      }
    }
    // const existingOption=response.filter(option=>{
    //   console.log(option);
    //    option.votedBy.some(vote=>vote==userId)
    // })
    // console.log(existingOption);
    // console.log(`line 30`);
    // const response=await Option.aggregate([
    //   { $match: { pollId: pollId } },
    //   {
    //     $match: { votedBy: userId },
    //   },
    // ]);
    console.log(response);
    return existingOption;
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};
