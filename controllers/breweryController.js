const Brewery = require("../models/brewery");
const asyncHandler = require("express-async-handler");

// Display list of all breweries
exports.brewery_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Brewery List");
});

// Display detail page for a specific Brewery
exports.brewery_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Brewery Detail: ${req.params.id}`);
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
