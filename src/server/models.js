const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const fileSchema = new Schema({
  id: String,
  filename: String,
  originalname: String,
});
const File = model("File", fileSchema);

module.exports = {File}