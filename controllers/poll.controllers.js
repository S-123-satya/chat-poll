const { asyncHandler } = require("./../utils/AsyncHandler.js");
const { ApiResponse } = require("./../utils/ApiResponse.js");
const User = require("../models/user.model.js");
const { ApiError } = require("../utils/ApiError.js");
const Chat = require("../models/chat.model.js");

const postPoll=asyncHandler(async(req,res,next)=>{
    const {question,sender,options}=req.body;
    if(!question || !sender)
        throw new ApiError(400,"message and sender should not be empty");
    if(!options || options.length ==0)
        throw new ApiError(400,"Options can not be empty");
    const newPoll=await Poll.create(req.body);
    console.log(newPoll);
    if(!newPoll)
        throw new ApiError(500,"something went wrong");
    res.status(201).json(new ApiResponse(201,"poll sent successfully",newPoll));
});

const getAllPolls=asyncHandler(async(req,res,next)=>{
    const {createdAtOffset} = req.query || 0;
    const allPolls=await Poll.find({created_at: {"$gte": createdAtOffset}})
    console.log(allPolls);
    res.status(200).json(new ApiResponse(200,"All messages are sent",allPolls));
})

module.exports={
    postPoll,
    getAllPolls,
}