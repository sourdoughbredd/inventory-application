const Beer = require("../models/beer");
const BeerSku = require("../models/beerSku");
const Brewery = require("../models/brewery");
const Type = require("../models/type");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
    .collation({ locale: "en" })
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
  const [breweries, types] = await Promise.all([
    Brewery.find({}, "name")
      .collation({ locale: "en" })
      .sort({ name: 1 })
      .exec(),
    Type.find({}, "name").collation({ locale: "en" }).sort({ name: 1 }).exec(),
  ]);

  res.render("beer_form", { title: "Add New Beer", breweries, types });
});

// Handle beer create on POST
exports.beer_create_post = [
  // Validate and sanitize
  body("name").trim(),
  body("brewery", "Invalid brewery").trim().isMongoId(),
  body("type", "Invalid beer type").trim().isMongoId(),
  body("description", "Description must be at least 3 characters long.")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 3 }),
  body("abv", "ABV must be a number between 0 and 100.")
    .trim()
    .isNumeric()
    .toFloat()
    .custom((val) => val >= 0 && val <= 100),
  body("ibu", "IBU must be a number greater than or equal to 0.")
    .optional({ values: "falsy" })
    .trim()
    .isNumeric()
    .toFloat()
    .custom((val) => val >= 0),
  body("flavors").trim(),

  // Process the request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create flavors array from comma-separated list
    const flavors_array = req.body.flavors
      ? req.body.flavors.split(",").map((elem) => elem.trim())
      : [];

    // Create the beer object
    const beer = new Beer({
      name: req.body.name,
      brewery: req.body.brewery,
      type: req.body.type,
      description: req.body.description,
      abv: req.body.abv,
      ibu: req.body.ibu,
      flavors: flavors_array,
    });

    // Check for validation errors
    if (!errors.isEmpty()) {
      // Errors found. Re-render beer form with errors display.
      const [breweries, types] = await Promise.all([
        Brewery.find({}, "name")
          .collation({ locale: "en" })
          .sort({ name: 1 })
          .exec(),
        Type.find({}, "name")
          .collation({ locale: "en" })
          .sort({ name: 1 })
          .exec(),
      ]);

      res.render("beer_form", {
        title: "Add New Beer",
        beer,
        breweries,
        types,
        errors: errors.array(),
      });
    }

    // Check that a matching beer doesn't already exist before creating
    const existingBeer = await Beer.findOne({
      name: req.body.name,
      brewery: req.body.brewery,
    }).exec();

    if (existingBeer) {
      // Redirect to existing beer's url
      res.redirect(existingBeer.url);
    } else {
      // Create the beer
      await beer.save();
      res.redirect(beer.url);
    }
  }),
];

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
