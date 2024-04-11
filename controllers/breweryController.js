const Brewery = require("../models/brewery");
const Beer = require("../models/beer");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all breweries
exports.brewery_list = asyncHandler(async (req, res, next) => {
  const breweries = await Brewery.find({}, "name city state country")
    .collation({ locale: "en" })
    .sort({ name: 1 })
    .exec();

  res.render("brewery_list", {
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
  res.render("brewery_form", { crud_op: "create" });
});

// Handle Brewery create on POST
exports.brewery_create_post = [
  // Validate and sanitize the request
  body("name", "Name must be at least 2 characters.")
    .trim()
    .isLength({ min: 2 }),
  body("description").optional({ values: "falsy" }).trim(),
  body("city", "City must be at least 2 characters.")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2 }),
  body("state", "State must be at least 2 characters.")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2 }),
  body("country", "Country must be at least 4 characters.")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 4 }),
  body("longitude_deg", "Longitude must be a number between -180 and 180.")
    .optional({ values: "falsy" })
    .trim()
    .isNumeric()
    .toFloat()
    .custom((val) => val >= -180 && val <= 180),
  body("latitude_deg", "Latitude must be a number between -90 and 90.")
    .optional({ values: "falsy" })
    .trim()
    .isNumeric()
    .toFloat()
    .custom((val) => val >= -90 && val <= 90),
  body("password", "Incorrect password. Please try again.")
    .trim()
    .custom((pwd) => pwd === process.env.ADMIN_PASS),

  // Process the request
  asyncHandler(async (req, res, next) => {
    // Extract any validation errors
    const errors = validationResult(req);

    // Create a new brewery object
    const location = {
      type: "Point",
      coordinates: [
        Number(req.body.latitude_deg),
        Number(req.body.longitude_deg),
      ],
    };
    const brewery = new Brewery({
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      location,
    });

    // Check for errors before continuing
    if (!errors.isEmpty()) {
      res.render("brewery_form", {
        crud_op: "create",
        brewery: brewery,
        errors: errors.array(),
      });
      return;
    }

    // Check if invalid password slipped through validation
    if (req.body.password !== process.env.ADMIN_PASS) {
      res.render("brewery_form", {
        crud_op: "create",
        brewery: brewery,
      });
      return;
    }

    // Make sure a matching brewery doesn't already exist.
    const existingBrewery = await Brewery.findOne({
      name: brewery.name,
    }).exec();

    if (existingBrewery) {
      res.redirect(existingBrewery.url);
      return;
    }

    // Save the new brewery
    await brewery.save();
    res.redirect(brewery.url);
  }),
];

// Display Brewery delete form on GET
exports.brewery_delete_get = asyncHandler(async (req, res, next) => {
  // Get the brewery and it's beers
  const [brewery, breweryBeers] = await Promise.all([
    Brewery.findById(req.params.id).exec(),
    Beer.find({ brewery: req.params.id }).exec(),
  ]);

  if (brewery === null) {
    // Brewery not found by ID. Redirect to brewery list.
    res.redirect("/inventory/breweries");
  }

  res.render("brewery_delete", {
    brewery,
    brewery_beers: breweryBeers,
  });
});

// Handle Brewery delete on POST
exports.brewery_delete_post = asyncHandler(async (req, res, next) => {
  // Get the brewery and their beers
  const [brewery, breweryBeers] = await Promise.all([
    Brewery.findById(req.body.breweryid).exec(),
    Beer.find({ brewery: req.body.breweryid }).exec(),
  ]);

  // Check that brewery doesn't have beers
  if (breweryBeers.length > 0) {
    // Beers still existing for this brewery. Show delete form
    res.render("brewery_delete", {
      brewery,
      brewery_beers: breweryBeers,
    });
    return;
  }

  // Check password
  if (req.body.password.trim() !== process.env.ADMIN_PASS) {
    res.render("brewery_delete", {
      brewery,
      brewery_beers: breweryBeers,
      incorrect_password: true,
    });
    return;
  }

  // Delete the brewery
  await Brewery.findByIdAndDelete(req.body.breweryid);
  res.redirect("/inventory/breweries");
});

// Display Brewery update form on GET
exports.brewery_update_get = asyncHandler(async (req, res, next) => {
  const brewery = await Brewery.findById(req.params.id);

  if (brewery === null) {
    // Brewery not found with this ID. Render brewery list.
    res.redirect("/inventory/breweries");
  }

  res.render("brewery_form", {
    crud_op: "update",
    brewery,
  });
});

// Handle Brewery update on POST
exports.brewery_update_post = [
  // Validate and sanitize the request
  body("name", "Name must be at least 2 characters.")
    .trim()
    .isLength({ min: 2 }),
  body("description").optional({ values: "falsy" }).trim(),
  body("city", "City must be at least 2 characters.")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2 }),
  body("state", "State must be at least 2 characters.")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2 }),
  body("country", "Country must be at least 4 characters.")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 4 }),
  body("longitude_deg", "Longitude must be a number between -180 and 180.")
    .optional({ values: "falsy" })
    .trim()
    .isNumeric()
    .toFloat()
    .custom((val) => val >= -180 && val <= 180),
  body("latitude_deg", "Latitude must be a number between -90 and 90.")
    .optional({ values: "falsy" })
    .trim()
    .isNumeric()
    .toFloat()
    .custom((val) => val >= -90 && val <= 90),
  body("password", "Incorrect password. Please try again.")
    .trim()
    .custom((pwd) => pwd === process.env.ADMIN_PASS),

  // Process the request
  asyncHandler(async (req, res, next) => {
    // Extract any validation errors
    const errors = validationResult(req);

    // Create a new brewery object
    const location = {
      type: "Point",
      coordinates: [
        Number(req.body.latitude_deg),
        Number(req.body.longitude_deg),
      ],
    };
    const brewery = new Brewery({
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      location,
    });

    console.log(errors.array());

    // Check for errors before continuing
    if (!errors.isEmpty()) {
      // Errors detected. Send back to the form.
      res.render("brewery_form", {
        crud_op: "update",
        brewery,
        errors: errors.array(),
      });
      return;
    }

    // Make sure incorrect password didn't slip through validation
    if (req.body.password !== process.env.ADMIN_PASS) {
      res.render("brewery_form", {
        crud_op: "update",
        brewery,
      });
      return;
    }

    // Make sure a brewery of this new name doesn't already exist before updating
    const existingBrewery = await Brewery.findOne({
      name: brewery.name,
      _id: { $ne: req.params.id },
    }).exec();

    if (existingBrewery) {
      res.redirect(existingBrewery.url);
      return;
    }

    // Update the brewery
    const updatedBrewery = await Brewery.findByIdAndUpdate(
      req.params.id,
      brewery,
      {}
    );
    res.redirect(updatedBrewery.url);
  }),
];
