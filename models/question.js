const mongoose = require("mongoose");

//define a story schema for the database
const QuestionSchema = new mongoose.Schema({
  // _id: String,
  text: String,
  day: String,
  index: String,
});

// compile model from schema
module.exports = mongoose.model("question", QuestionSchema);
