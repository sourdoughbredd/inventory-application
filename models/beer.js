const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BeerSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  brewery: { type: Schema.Types.ObjectId, ref: "Brewery", required: true },
  type: { type: Schema.Types.ObjectId, ref: "Type", required: true },
  abv: { type: Number, required: true },
  ibu: { type: Number },
  description: { type: String },
  flavors: [{ type: String }],
});

// Virtual for beer's URL
BeerSchema.virtual("url").get(function () {
  return `/inventory/beer/${this._id}`;
});

// Export model
module.exports = mongoose.model("Beer", BeerSchema);
