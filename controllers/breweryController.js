const Brewery = require("../models/brewery");
const Beer = require("../models/beer");
const asyncHandler = require("express-async-handler");

// Display list of all breweries
exports.brewery_list = asyncHandler(async (req, res, next) => {
  const breweries = await Brewery.find({}, "name city state country")
    .sort({ name: 1 })
    .exec();

  res.render("brewery_list", {
    title: "Brewery List",
    brewery_list: breweries,
  });
});

// Display detail page for a specific Brewery
exports.brewery_detail = asyncHandler(async (req, res, next) => {
  const [brewery, breweryBeers] = await Promise.all([
    Brewery.findById(
      req.params.id,
      "name city state country description"
    ).exec(),
    Beer.find({ brewery: req.params.id }, "name type").populate("type").exec(),
  ]);

  res.render("brewery_detail", {
    brewery,
    brewery_beers: breweryBeers,
  });
});

// Display Brewery create form on GET
exports.brewery_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Brewery create GET");
});

// Handle Brewery create on POST
exports.brewery_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Brewery create POST");
});

// Display Brewery delete form on GET
exports.brewery_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Brewery delete GET: ${req.params.id}`);
});

// Handle Brewery delete on POST
exports.brewery_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Brewery delete POST: ${req.params.id}`);
});

// Display Brewery update form on GET
exports.brewery_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Brewery update GET: ${req.params.id}`);
});

// Handle Brewery update on POST
exports.brewery_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Brewery update POST: ${req.params.id}`);
});
