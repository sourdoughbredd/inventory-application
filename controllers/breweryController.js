const Brewery = require("../models/brewery");
const Beer = require("../models/beer");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Helper to create breweries with optional args
function breweryCreate(
  _id,
  name,
  description,
  city,
  state,
  country,
  latitude_deg,
  longitude_deg
) {
  const brewerydetail = { name };
  if (_id) brewerydetail._id = _id;
  if (description) brewerydetail.description = description;
  if (city) brewerydetail.city = city;
  if (state) brewerydetail.state = state;
  if (country) brewerydetail.country = country;
  if (latitude_deg && longitude_deg) {
    brewerydetail.location = {
      type: "Point",
      coordinates: [Number(latitude_deg), Number(longitude_deg)],
    };
  }

  return new Brewery(brewerydetail);
}

// Display list of all breweries
exports.brewery_list = asyncHandler(async (req, res, next) => {
  const breweries = await Brewery.find({}, "name city state country")
    .collation({ locale: "en" })
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
  res.render("brewery_form", { title: "Add New Brewery" });
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

  // Process the request
  asyncHandler(async (req, res, next) => {
    // Extract any validation errors
    const errors = validationResult(req);

    // Create a new brewery object
    const brewery = breweryCreate(
      "",
      req.body.name,
      req.body.description,
      req.body.city,
      req.body.state,
      req.body.country,
      req.body.latitude_deg,
      req.body.longitude_deg
    );

    // Check for errors before continuing
    if (!errors.isEmpty()) {
      res.render("brewery_form", {
        title: "Add New Brewery",
        brewery: brewery,
        errors: errors.array(),
      });
    } else {
      // Make sure a matching brewery doesn't already exist.
      const existingBrewery = await Brewery.findOne({
        name: brewery.name,
      }).exec();

      if (existingBrewery) {
        res.redirect(existingBrewery.url);
      } else {
        await brewery.save();
        res.redirect(brewery.url);
      }
    }
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
    title: "Delete Brewery: " + brewery.name,
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

  if (breweryBeers.length > 0) {
    // Beers still existing for this brewery. Show delete form
    res.render("brewery_delete", {
      title: "Delete Brewery: " + brewery.name,
      brewery,
      brewery_beers: breweryBeers,
    });
  }
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
    title: "Update Brewery: " + brewery.name,
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

  // Process the request
  asyncHandler(async (req, res, next) => {
    // Extract any validation errors
    const errors = validationResult(req);

    // Create a new brewery object
    const brewery = breweryCreate(
      req.params.id,
      req.body.name,
      req.body.description,
      req.body.city,
      req.body.state,
      req.body.country,
      req.body.latitude_deg,
      req.body.longitude_deg
    );

    // Check for errors before continuing
    if (!errors.isEmpty()) {
      // Errors detected. Send back to the form.
      res.render("brewery_form", {
        title: "Update Brewery: " + brewery.name,
        brewery,
        errors: errors.array(),
      });
    } else {
      // Make sure a brewery of this new name doesn't already exist before updating
      const existingBrewery = await Brewery.findOne({
        name: brewery.name,
        _id: { $ne: req.params.id },
      }).exec();

      if (existingBrewery) {
        res.redirect(existingBrewery.url);
      } else {
        const updatedBrewery = await Brewery.findByIdAndUpdate(
          req.params.id,
          brewery,
          {}
        );
        res.redirect(updatedBrewery.url);
      }
    }
  }),
];
