const BeerSku = require("../models/beerSku");
const Beer = require("../models/beer");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const OZ_TO_ML = 29.5735;

// Display list of all beer SKUs
exports.beersku_list = asyncHandler(async (req, res, next) => {
  const beerSkus = await BeerSku.find({})
    .collation({ locale: "en" })
    .populate("beer")
    .sort({ "beer.name": 1 })
    .exec();

  res.render("beersku_list", {
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
  const beers = await Beer.find({}, "name brewery")
    .collation({ locale: "en" })
    .sort({ name: 1 })
    .populate("brewery")
    .exec();

  res.render("beersku_form", { crud_op: "create", beers });
});

// Handle beer SKU create on POST
exports.beersku_create_post = [
  // Validate and sanitize
  body("beer", "Invalid beer").isMongoId(),
  body("packaging_type", "Packaging type").trim().isLength({ min: 1 }),
  body("packaging_volume_oz", "Volume must be a number greater than 0.")
    .trim()
    .isNumeric()
    .toFloat()
    .custom((val) => val > 0),
  body(
    "packaging_quantity",
    "Packaging quantity must be an integer greater than 0."
  )
    .trim()
    .isInt({ min: 1 })
    .toInt(),
  body("price", "Price must be a number greater than or equal to 0.00")
    .trim()
    .isNumeric()
    .toFloat()
    .custom((val) => val >= 0),
  body("stock", "Stock must be an integer greater than or equal to 0")
    .trim()
    .isInt({ min: 0 })
    .toInt(),

  // Process request
  asyncHandler(async (req, res, next) => {
    // Extract validation results
    const errors = validationResult(req);

    // Create new beer SKU
    const beerSku = new BeerSku({
      beer: req.body.beer,
      packaging: {
        type: req.body.packaging_type,
        volume_oz: req.body.packaging_volume_oz,
        volume_ml: Math.round(OZ_TO_ML * req.body.packaging_volume_oz),
        quantity: req.body.packaging_quantity,
      },
      price: req.body.price,
      stock: req.body.stock,
    });

    // Handle any validation errors
    if (!errors.isEmpty()) {
      // Re-render form and show errors to user
      const beers = await Beer.find({})
        .collation({ locale: "en" })
        .sort({ name: 1 })
        .populate("brewery")
        .exec();

      res.render("beersku_form", {
        crud_op: "create",
        beers,
        beersku: beerSku,
        selected_beer: beerSku.beer._id,
        errors: errors.array(),
      });
    }

    // Make sure beer SKU doesn't already exist
    const existingBeerSku = await BeerSku.findOne({
      _id: { $ne: req.params.id },
      beer: req.body.beer,
      packaging: beerSku.packaging,
    });

    if (existingBeerSku) {
      res.redirect(existingBeerSku.url);
    } else {
      await beerSku.save();
      res.redirect(beerSku.url);
    }
  }),
];

// Display beer SKU delete form on GET
exports.beersku_delete_get = asyncHandler(async (req, res, next) => {
  const beerSku = await BeerSku.findById(req.params.id).populate("beer").exec();

  if (beerSku === null) {
    // Could not find beer SKU with ID provided
    res.redirect("/inventory/beerskus");
  }

  res.render("beersku_delete", {
    beersku: beerSku,
  });
});

// Handle beer SKU delete on POST
exports.beersku_delete_post = asyncHandler(async (req, res, next) => {
  // Get the beer SKU
  const beerSku = await BeerSku.findById(req.body.beerskuid).exec();

  // Redirect if it wasn't found
  if (beerSku === null) {
    res.redirect("/inventory/beerskus");
  }

  await BeerSku.findByIdAndDelete(req.body.beerskuid);
  res.redirect("/inventory/beerskus");
});

// Display beer SKU update form on GET
exports.beersku_update_get = asyncHandler(async (req, res, next) => {
  // Get the beer SKU
  const [beerSku, beers] = await Promise.all([
    BeerSku.findById(req.params.id).exec(),
    Beer.find({}, "name brewery")
      .collation({ locale: "en" })
      .sort({ name: 1 })
      .populate("brewery")
      .exec(),
  ]);

  // Redirect if it wasn't found
  if (beerSku === null) {
    res.redirect("/inventory/beerskus");
  }

  res.render("beersku_form", {
    crud_op: "update",
    beers,
    beersku: beerSku,
    selected_beer: beerSku.beer,
  });
});

// Handle beer SKU update on POST
exports.beersku_update_post = [
  // Validate and sanitize
  body("beer", "Invalid beer").isMongoId(),
  body("packaging_type", "Packaging type").trim().isLength({ min: 1 }),
  body("packaging_volume_oz", "Volume must be a number greater than 0.")
    .trim()
    .isNumeric()
    .toFloat()
    .custom((val) => val > 0),
  body(
    "packaging_quantity",
    "Packaging quantity must be an integer greater than 0."
  )
    .trim()
    .isInt({ min: 1 })
    .toInt(),
  body("price", "Price must be a number greater than or equal to 0.00")
    .trim()
    .isNumeric()
    .toFloat()
    .custom((val) => val >= 0),
  body("stock", "Stock must be an integer greater than or equal to 0")
    .trim()
    .isInt({ min: 0 })
    .toInt(),

  // Process request
  asyncHandler(async (req, res, next) => {
    // Extract validation results
    const errors = validationResult(req);

    // Create new beer SKU
    const beerSku = new BeerSku({
      _id: req.params.id,
      beer: req.body.beer,
      packaging: {
        type: req.body.packaging_type,
        volume_oz: req.body.packaging_volume_oz,
        volume_ml: Math.round(OZ_TO_ML * req.body.packaging_volume_oz),
        quantity: req.body.packaging_quantity,
      },
      price: req.body.price,
      stock: req.body.stock,
    });

    // Handle any validation errors
    if (!errors.isEmpty()) {
      // Re-render form and show errors to user
      const beers = await Beer.find({})
        .collation({ locale: "en" })
        .sort({ name: 1 })
        .populate("brewery")
        .exec();

      res.render("beersku_form", {
        crud_op: "update",
        beers,
        beersku: beerSku,
        selected_beer: beerSku.beer,
        errors: errors.array(),
      });
    }

    // Make sure beer SKU doesn't already exist
    const existingBeerSku = await BeerSku.findOne({
      _id: { $ne: req.params.id },
      beer: req.body.beer,
      packaging: beerSku.packaging,
    });

    if (existingBeerSku) {
      res.redirect(existingBeerSku.url);
    } else {
      await BeerSku.findByIdAndUpdate(req.params.id, beerSku, {}).exec();
      res.redirect(beerSku.url);
    }
  }),
];
