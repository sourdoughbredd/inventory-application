const BeerSku = require("../models/beerSku");
const asyncHandler = require("express-async-handler");

// Display list of all beer SKUs
exports.beerSku_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Beer SKU List");
});

// Display detail page for a specific beer SKU
exports.beerSku_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer SKU Detail: ${req.params.id}`);
});

// Display beer SKU create for on GET
exports.beerSku_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Beer SKU create GET");
});

// Handle beer SKU create on POST
exports.beerSku_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Beer SKU create POST");
});

// Display beer SKU delete for on GET
exports.beerSku_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer SKU delete GET: ${req.params.id}`);
});

// Handle beer SKU delete on POST
exports.beerSku_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer SKU delete POST: ${req.params.id}`);
});

// Display beer SKU update for on GET
exports.beerSku_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer SKU update GET: ${req.params.id}`);
});

// Handle beer SKU update on POST
exports.beerSku_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Beer SKU update POST: ${req.params.id}`);
});
