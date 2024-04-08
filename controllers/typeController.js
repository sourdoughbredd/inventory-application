const Type = require("../models/type");
const asyncHandler = require("express-async-handler");

// Display list of all types
exports.type_list = asyncHandler(async (req, res, next) => {
  const types = await Type.find({}).sort({ name: 1 }).exec();

  res.render("type_list", {
    title: "Beer Types",
    type_list: types,
  });
});

// Display detail page for a specific Type
exports.type_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Type Detail: ${req.params.id}`);
});

// Display Type create form on GET
exports.type_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Type create GET");
});

// Handle Type create on POST
exports.type_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Type create POST");
});

// Display Type delete form on GET
exports.type_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Type delete GET: ${req.params.id}`);
});

// Handle Type delete on POST
exports.type_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Type delete POST: ${req.params.id}`);
});

// Display Type update form on GET
exports.type_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Type update GET: ${req.params.id}`);
});

// Handle Type update on POST
exports.type_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Type update POST: ${req.params.id}`);
});
