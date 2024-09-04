const mongoose = require("mongoose");

const DaySchema = new mongoose.Schema({
    // userId: String,
    // day : {type : String, default : new Date().toString().slice(0,15)},
    // answers: {type : String[9], default : ["","","","","","","","","",]},
    // tries : {type : Number, default : 9},
});

// compile model from schema
module.exports = mongoose.model("day", DaySchema);