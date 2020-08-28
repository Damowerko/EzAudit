const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const comment = new Schema({
  text: String,
  isPrivate: {type: Boolean, default: true},
});

const fileSchema = new Schema({
  filename: String,
  originalname: String,
  comments: [comment],
  tags: [String],
  date: { type: Date, default: Date.now }
});
const File = model("File", fileSchema);

const standardsElementSchema = new Schema({
  element_id: Number,
  comments: [comment],
  tags: [String],
});
const StandardsElement = model("StandardsElement", standardsElementSchema);

module.exports = {File, StandardsElement};
