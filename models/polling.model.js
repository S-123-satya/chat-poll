const mongoose = require("mongoose");

const pollingSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isMultipleSelect:{
      type:Boolean,
      defaultValues:false,
    }
  },
  { timestamps: true }
);

const Poll = mongoose.model("Poll", pollingSchema);

module.exports = Poll;
