const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  userId: String,
  day : {type : String, default : new Date().toString().slice(0,15)},
  answer: String,
  position_x: Number,
  position_y: Number,
  correctness : Boolean,
  score : Number,
});

// compile model from schema
module.exports = mongoose.model("answer", AnswerSchema);
