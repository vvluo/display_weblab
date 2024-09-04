const mongoose = require("mongoose");

const Settings = new mongoose.Schema({
  googleid: String,
  attri: String,
  state: String,
  guessCount: Number,
  type: String,
});

// compile model from schema
module.exports = mongoose.model("settings", Settings);
