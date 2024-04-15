const express = require("express");
const router = express.Router();

// Import controller
const locationController = require("../controllers/locationController");

// Define endpoints

// GET list of countries
router.get("/countries", locationController.get_countries);

// GET list of states for a country
router.get(
  "/countries/:countryIso2/states",
  locationController.get_states_by_country
);

// GET list of cities for a given state
router.get(
  "/countries/:countryIso2/states/:stateIso2/cities",
  locationController.get_cities_by_state
);

// GET state details (for lat-lon)
router.get(
  "/countries/:countryIso2/states/:stateIso2",
  locationController.get_state_details
);

module.exports = router;
