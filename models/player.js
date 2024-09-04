const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  userId: String,
  daysPlayed : [String],

  answers: [mongoose.Schema.ObjectId],
});

// compile model from schema
module.exports = mongoose.model("answer", AnswerSchema);
