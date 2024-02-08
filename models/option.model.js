const mongoose =require("mongoose");

const optionSchema=new mongoose.Schema({
    optionText:{
        type:String,
        required:true,
    },
    pollId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Poll",
        required:true,
    },
    votedBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    voteCount:{
        type:Number,
        defaultValues:0,
    }
},{timestamps:true});

const Option=mongoose.model("Option",optionSchema);



module.exports=Option;