const { asyncHandler } = require("./../utils/AsyncHandler.js");
const { ApiResponse } = require("./../utils/ApiResponse.js");
const User = require("../models/user.model.js");
const { ApiError } = require("../utils/ApiError.js");
const Chat = require("../models/chat.model.js");
const Poll = require("../models/polling.model.js");

const postChat=asyncHandler(async(req,res,next)=>{
    const {message,sender}=req.body;
    if(!message || !sender)
        throw new ApiError(400,"message and sender should not be empty");
    const newMessage=await Chat.create(req.body);
    if(!newMessage)
        throw new ApiError(500,"something went wrong");
    res.status(201).json(new ApiResponse(201,"message sent successfully",newMessage));
})

const getAllChats=asyncHandler(async(req,res,next)=>{
    const {createdAtOffset} = req.query || 0;
    const allChats=await Chat.find({created_at: {"$gte": createdAtOffset}})
    const allPolls=await Poll.find({created_at: {"$gte": createdAtOffset}})
    console.log(allChats);
    res.status(200).json(new ApiResponse(200,"All messages are sent",{allChats,allPolls}));
})

module.exports={
    postChat,
    getAllChats,
}