const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TypeSchema = new Schema({
  name: { type: String, unique: true, required: true, maxLength: 50 },
});

// Virtual for Type's url
TypeSchema.virtual("url").get(function () {
  return `/inventory/type/${this._id}`;
});

// Export model
module.exports = mongoose.model("Type", TypeSchema);
