const mongoose = require("mongoose");

//define a story schema for the database
const BoxSchema = new mongoose.Schema({
  date: String,
  position: {
    x: Number,
    y: Number,
  },
  answer: String,
});

// compile model from schema
module.exports = mongoose.model("box", BoxSchema);
