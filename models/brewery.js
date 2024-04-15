const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Location schema to store in GeoJSON point format
const PointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const BrewerySchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String },
  city: { type: String },
  state: { type: String, minLength: 1 },
  country: { type: String, minLength: 1 },
  location: { type: PointSchema },
});

// Virtual for Brewery url
BrewerySchema.virtual("url").get(function () {
  return `/inventory/brewery/${this._id}`;
});

// Export model
module.exports = mongoose.model("Brewery", BrewerySchema);
