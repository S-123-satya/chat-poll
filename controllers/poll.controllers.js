const { asyncHandler } = require("./../utils/AsyncHandler.js");
const { ApiResponse } = require("./../utils/ApiResponse.js");
const User = require("../models/user.model.js");
const { ApiError } = require("../utils/ApiError.js");
const Chat = require("../models/chat.model.js");
const Option = require("../models/option.model.js");
const Poll = require("../models/polling.model.js");
const { searchExistedUser } = require("../utils/helpers.js");

const postPoll = asyncHandler(async (req, res, next) => {
  const { question, options, isMultipleSelect } = req.body;
  if (!question) throw new ApiError(400, "message should not be empty");
  if (!options || options.length == 0)
    throw new ApiError(400, "Options can not be empty");
  const pollObj = {
    question,
    createdBy: req?.user?._id,
    isMultipleSelect: isMultipleSelect || false,
  };
  const newPoll = await Poll.create(pollObj);
  if (!newPoll) throw new ApiError(500, "Something went wrong");
  const newOptions = [];
  options.filter((option) => {
    if (option?.trim().length != 0) {
      newOptions.push({
        optionText: option?.trim(),
        pollId: newPoll?._id,
        votedBy: [],
        voteCount: 0,
      });
    }
  });
  const optionResponse = await Option.insertMany(newOptions);
  if (!optionResponse) throw new ApiError(500, "Something went wrong");
  res.status(201).json(
    new ApiResponse(201, "poll sent successfully", {
      newPoll,
      options: optionResponse,
      sender: req.user?.username,
    })
  );
});

const getAllPolls = asyncHandler(async (req, res, next) => {
  const { createdAtOffset } = req.query || 0;
  const allPolls = await Poll.find({ created_at: { $gte: createdAtOffset } });
  res.status(200).json(new ApiResponse(200, "All messages are sent", allPolls));
});

const updatePoll = asyncHandler(async (req, res, next) => {
  const { pollId, optionId } = req.body;
  const poll = await Poll.findById(pollId);
  if (!pollId) throw new ApiError(404, "Poll not found");
  if (poll.isMultipleSelect == true) {
    // multiple option selection allow hai
    const option = await Option.findById(optionId);
    if (!option) throw new ApiError(404, "Option not found");
    const existedUser = option.votedBy.some(
      (user) => String(user) == String(req.user?._id)
    );
    if (existedUser) {
      // do nothing silent kill it
      const newVotedby = option.votedBy.filter(
        (user) => String(user) != String(req?.user?._id)
      );
      option.votedBy = newVotedby;
      option.voteCount -= 1;
      await option.save();
      res.status(200).json(
        new ApiResponse(201, "User voted", {
          updatedOption: option,
          isMultipleSelect: true,
        })
      );
    } else {
      option.votedBy.push(req.user?._id);
      option.voteCount += 1;
      await option.save();
      res.status(201).json(
        new ApiResponse(201, "User voted", {
          updatedOption: option,
          isMultipleSelect: true,
        })
      );
    }
  } else {
    // multiple option allowed nhi hai
    // use aggregation because it will be easy to find voted user
    let existedUserOption = await searchExistedUser(pollId, req.user._id);
    if (!existedUserOption) {
      // means did not vote yet
      const updatedOption = await Option.findById(optionId);
      updatedOption.votedBy.push(req.user?._id);
      updatedOption.voteCount += 1;
      const response = await updatedOption.save();
      res
        .status(201)
        .json(new ApiResponse(201, "user voted", { updatedOption }));
    } else {
      /**
       * @user voted so basically we have to delete/remove older vote and we have to update new vote
       * @first we will check that if user is voting the same older option or different new one
       */
      if (existedUserOption._id == optionId) {
        // do nothing because it's same one
        res
          .status(409)
          .json(new ApiResponse(409, "User already voted same option"));
      } else {
        /**
         * @first we need to remove older vote
         * @second we will update new option vote
         * @third we will send older and newer option ot frontend for dom manipulation
         */
        const updatedUserForOlderOption = existedUserOption?.votedBy?.filter(
          (user) => user != req.user?.id
        );
        existedUserOption.votedBy = updatedUserForOlderOption;
        existedUserOption.voteCount -= 1;
        const olderOptionresponse = await existedUserOption.save();
        // now update new option
        const updatedOption = await Option.findById(optionId);
        updatedOption.votedBy.push(req.user?._id);
        updatedOption.voteCount += 1;
        const response = await updatedOption.save();
        res.status(201).json(
          new ApiResponse(201, "user voted", {
            existedUserOption,
            updatedOption,
          })
        );
      }
    }
  }
});

module.exports = {
  postPoll,
  getAllPolls,
  updatePoll,
};
