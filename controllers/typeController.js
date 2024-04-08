const Type = require("../models/type");
const Beer = require("../models/beer");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all types
exports.type_list = asyncHandler(async (req, res, next) => {
  const types = await Type.find({})
    .collation({ locale: "en" })
    .sort({ name: 1 })
    .exec();

  res.render("type_list", {
    title: "Beer Types",
    type_list: types,
  });
});

// Display detail page for a specific Type
exports.type_detail = asyncHandler(async (req, res, next) => {
  const [type, typeBeers] = await Promise.all([
    Type.findById(req.params.id).exec(),
    Beer.find({ type: req.params.id }, "name brewery")
      .populate("brewery")
      .collation({ locale: "en" })
      .sort({ name: 1 })
      .exec(),
  ]);

  res.render("type_detail", {
    type,
    type_beers: typeBeers,
  });
});

// Display Type create form on GET
exports.type_create_get = asyncHandler(async (req, res, next) => {
  res.render("type_form", { title: "Create Beer Type" });
});

// Handle Type create on POST
exports.type_create_post = [
  // Validate and sanitize the request
  body("name", "Name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  // Process the request
  asyncHandler(async (req, res, next) => {
    // Extract validation errors
    const errors = validationResult(req);

    // Create type object with the request data
    const type = new Type({ name: req.body.name });

    // Process request
    if (!errors.isEmpty()) {
      // Validation errors detected. Send error data back to form.
      res.render("type_form", {
        title: "Create Beer Type",
        type: type,
        errors: errors.array(),
      });
    } else {
      // No errors. Save to database unless it already exists.
      const typeExists = await Type.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (typeExists) {
        // Already exists. Redirect to detail page.
        res.redirect(typeExists.url);
      } else {
        // Brand new type. Create and redirect to detail page
        await type.save();
        res.redirect(type.url);
      }
    }
  }),
];

// Display Type delete form on GET
exports.type_delete_get = asyncHandler(async (req, res, next) => {
  // Get type and beers of this type
  const [type, beersOfType] = await Promise.all([
    Type.findById(req.params.id).exec(),
    Beer.find({ type: req.params.id }).populate("brewery").exec(),
  ]);

  if (type === null) {
    // No results for this ID.
    res.redirect("/inventory/types");
  }

  res.render("type_delete", {
    title: "Delete Beer Type: " + type.name,
    type: type,
    beers_of_type: beersOfType,
  });
});

// Handle Type delete on POST
exports.type_delete_post = asyncHandler(async (req, res, next) => {
  const [type, beersOfType] = await Promise.all([
    Type.findById(req.body.typeid).exec(),
    Beer.find({ type: req.body.typeid }).populate("brewery").exec(),
  ]);

  if (beersOfType.length > 0) {
    // Beers of this type found. Render the delete page.
    res.render("type_delete", {
      title: "Delete Beer Type: " + type.name,
      type: type,
      beers_of_type: beersOfType,
    });
  } else {
    // No beers of this type. Free to delete
    await Type.findByIdAndDelete(req.body.typeid);
    res.redirect("/inventory/types");
  }
});

// Display Type update form on GET
exports.type_update_get = asyncHandler(async (req, res, next) => {
  const type = await Type.findById(req.params.id).exec();

  if (type == null) {
    // Typ enot foudn by ID. Show type list page.
    res.redirect("/inventory/types");
  }

  res.render("type_form", {
    title: "Update Beer Type: " + type.name,
    type: type,
  });
});

// Handle Type update on POST
exports.type_update_post = [
  // Validate and sanitize
  body("name", "Name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  // Process request
  asyncHandler(async (req, res, next) => {
    // Extract validation results
    const errors = validationResult(req);

    // Create new type object
    const type = new Type({
      _id: req.params.id,
      name: req.body.name,
    });

    // Process
    if (!errors.isEmpty()) {
      // Validation errors detected. Send error data back to form.
      res.render("type_form", {
        title: "Update Beer Type",
        type: type,
        errors: errors.array(),
      });
    } else {
      // No errors. Save to database unless it already exists.
      const typeExists = await Type.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (typeExists) {
        // Already exists. Redirect to detail page.
        res.redirect(typeExists.url);
      } else {
        // Type does not exist. Update and redirect to detail page
        const updatedType = await Type.findByIdAndUpdate(
          req.params.id,
          type,
          {}
        );
        res.redirect(updatedType.url);
      }
    }
  }),
];
