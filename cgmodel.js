const mongoose = require("mongoose");
const { Schema } = mongoose;
const cgpaSchema = new Schema({
  Regn: {
    type: String,
  },
  Name: {
    type: String,
  },
  Cgpa: {
    type: Number,
  },
});
module.exports = mongoose.model("Cgpa", cgpaSchema);
