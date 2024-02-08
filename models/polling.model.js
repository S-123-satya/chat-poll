const mongoose = require("mongoose");

const pollingSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: [{ option: String, vote: Number }],
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Poll = mongoose.model("Poll", pollingSchema);

module.exports = Poll;
