const Beer = require("../models/beer");
const asyncHandler = require("express-async-handler");

// Display the site home page
exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
});

// Display list of all beers
exports.beer_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Beer List");
});

// Display detail page for a specific beer
exports.beer_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer Detail: ${req.params.id}`);
});

// Display beer create for on GET
exports.beer_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Beer create GET");
});

// Handle beer create on POST
exports.beer_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Beer create POST");
});

// Display beer delete for on GET
exports.beer_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer delete GET: ${req.params.id}`);
});

// Handle beer delete on POST
exports.beer_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer delete POST: ${req.params.id}`);
});

// Display beer update for on GET
exports.beer_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer update GET: ${req.params.id}`);
});

// Handle beer update on POST
exports.beer_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer update POST: ${req.params.id}`);
});
