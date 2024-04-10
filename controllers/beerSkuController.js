const BeerSku = require("../models/beerSku");
const Beer = require("../models/beer");
const asyncHandler = require("express-async-handler");

// Display list of all beer SKUs
exports.beersku_list = asyncHandler(async (req, res, next) => {
  const beerSkus = await BeerSku.find({})
    .collation({ locale: "en" })
    .populate("beer")
    .sort({ "beer.name": 1 })
    .exec();

  res.render("beersku_list", {
    title: "Beer SKU List",
    beersku_list: beerSkus,
  });
});

// Display detail page for a specific beer SKU
exports.beersku_detail = asyncHandler(async (req, res, next) => {
  const beerSku = await BeerSku.findById(req.params.id).populate("beer").exec();

  res.render("beersku_detail", {
    beersku: beerSku,
  });
});

// Display beer SKU create form on GET
exports.beersku_create_get = asyncHandler(async (req, res, next) => {
  // Get beers to populate list of possible beers to create SKU from
  const beers = await Beer.find({})
    .collation({ locale: "en" })
    .sort({ name: 1 })
    .populate("brewery")
    .exec();

  res.render("beersku_form", { title: "Create New Beer SKU", beers });
});

// Handle beer SKU create on POST
exports.beersku_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Beer SKU create POST");
});

// Display beer SKU delete form on GET
exports.beersku_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer SKU delete GET: ${req.params.id}`);
});

// Handle beer SKU delete on POST
exports.beersku_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer SKU delete POST: ${req.params.id}`);
});

// Display beer SKU update form on GET
exports.beersku_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer SKU update GET: ${req.params.id}`);
});

// Handle beer SKU update on POST
exports.beersku_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer SKU update POST: ${req.params.id}`);
});
