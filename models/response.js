const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
  // _id: String,
  userId: String,
  content: String,
  date: String,
});

// compile model from schema
module.exports = mongoose.model("response", ResponseSchema);
