const Beer = require("../models/beer");
const BeerSku = require("../models/beerSku");
const Brewery = require("../models/brewery");
const Type = require("../models/type");
const asyncHandler = require("express-async-handler");

// Display the site home page
exports.index = asyncHandler(async (req, res, next) => {
  // Get records
  const [numBeers, numBeerSkus, numBeerSkusInStock, numBreweries, numTypes] =
    await Promise.all([
      Beer.countDocuments({}).exec(),
      BeerSku.countDocuments({}).exec(),
      BeerSku.countDocuments({ stock: { $gt: 0 } }).exec(),
      Brewery.countDocuments({}).exec(),
      Type.countDocuments({}).exec(),
    ]);

  res.render("index", {
    title: "Beer Inventory Home",
    beer_count: numBeers,
    beersku_count: numBeerSkus,
    beersku_in_stock_count: numBeerSkusInStock,
    brewery_count: numBreweries,
    type_count: numTypes,
  });
});

// Display list of all beers with name, brewery name, type, description, flavor notes
exports.beer_list = asyncHandler(async (req, res, next) => {
  const beers = await Beer.find({}, "name brewery")
    .sort({ name: 1 })
    .populate({ path: "brewery", select: "name" })
    .exec();

  res.render("beer_list", {
    title: "Beer List",
    beer_list: beers,
  });
});

// Display detail page for a specific beer
exports.beer_detail = asyncHandler(async (req, res, next) => {
  // Get beer and its SKUs
  const [beer, beerSkus] = await Promise.all([
    Beer.findById(req.params.id).populate("brewery").populate("type").exec(),
    BeerSku.find({ beer: req.params.id }).exec(),
  ]);

  res.render("beer_detail", {
    beer: beer,
    beer_skus: beerSkus,
  });
});

// Display beer create form on GET
exports.beer_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Beer create GET");
});

// Handle beer create on POST
exports.beer_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Beer create POST");
});

// Display beer delete form on GET
exports.beer_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer delete GET: ${req.params.id}`);
});

// Handle beer delete on POST
exports.beer_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer delete POST: ${req.params.id}`);
});

// Display beer update form on GET
exports.beer_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer update GET: ${req.params.id}`);
});

// Handle beer update on POST
exports.beer_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer update POST: ${req.params.id}`);
});
