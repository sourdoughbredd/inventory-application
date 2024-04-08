const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PackagingSchema = new Schema(
  {
    type: { type: String, required: true },
    volume_oz: { type: Number, required: true },
    volume_ml: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const BeerSkuSchema = new Schema({
  beer: { type: Schema.Types.ObjectId, ref: "Beer", required: true },
  packaging: { type: PackagingSchema, required: true },
  stock: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
});

// Virtual for Beer SKU url
BeerSkuSchema.virtual("url").get(function () {
  return `/inventory/beersku/${this._id}`;
});

// Export model
module.exports = mongoose.model("BeerSku", BeerSkuSchema);
