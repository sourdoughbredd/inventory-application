const express = require("express");
const router = express.Router();

// Require controller modules
const beer_controller = require("../controllers/beerController");
const beersku_controller = require("../controllers/beerSkuController");
const brewery_controller = require("../controllers/breweryController");
const type_controller = require("../controllers/typeController");

//// BEER ROUTES ////

// GET inventory home page
router.get("/", beer_controller.index);

// GET request for list of beers
router.get("/beers", beer_controller.beer_list);

// GET request for creating a beer
router.get("/beer/create", beer_controller.beer_create_get);

// POST request for creating a beer
router.post("/beer/create", beer_controller.beer_create_post);

// GET request for deleting a beer
router.get("/beer/delete", beer_controller.beer_delete_get);

// POST request for deleting a beer
router.post("/beer/delete", beer_controller.beer_delete_post);

// GET request for updating a beer
router.get("/beer/update", beer_controller.beer_update_get);

// POST request for updating a beer
router.post("/beer/update", beer_controller.beer_update_post);

// GET request for a single beer detail
router.get("/beer/:id", beer_controller.beer_detail);

//// BREWERY ROUTES ////

// GET request for list of breweries
router.get("/breweries", brewery_controller.brewery_list);

// GET request for creating a brewery
router.get("/brewery/create", brewery_controller.brewery_create_get);

// POST request for creating a brewery
router.post("/brewery/create", brewery_controller.brewery_create_post);

// GET request for deleting a brewery
router.get("/brewery/delete", brewery_controller.brewery_delete_get);

// POST request for deleting a brewery
router.post("/brewery/delete", brewery_controller.brewery_delete_post);

// GET request for updating a brewery
router.get("/brewery/update", brewery_controller.brewery_update_get);

// POST request for updating a brewery
router.post("/brewery/update", brewery_controller.brewery_update_post);

// GET request for a single brewery detail
router.get("/brewery/:id", brewery_controller.brewery_detail);

//// TYPE ROUTES ////

// GET request for list of types
router.get("/types", type_controller.type_list);

// GET request for creating a type
router.get("/type/create", type_controller.type_create_get);

// POST request for creating a type
router.post("/type/create", type_controller.type_create_post);

// GET request for deleting a type
router.get("/type/delete", type_controller.type_delete_get);

// POST request for deleting a type
router.post("/type/delete", type_controller.type_delete_post);

// GET request for updating a type
router.get("/type/update", type_controller.type_update_get);

// POST request for updating a type
router.post("/type/update", type_controller.type_update_post);

// GET request for a single type detail
router.get("/type/:id", type_controller.type_detail);

//// BEER SKU ROUTES ////

// GET request for list of beer SKUs
router.get("/beerSkus", beersku_controller.beersku_list);

// GET request for creating a beer SKU
router.get("/beerSku/create", beersku_controller.beersku_create_get);

// POST request for creating a beer SKU
router.post("/beerSku/create", beersku_controller.beersku_create_post);

// GET request for deleting a beer SKU
router.get("/beerSku/delete", beersku_controller.beersku_delete_get);

// POST request for deleting a beer SKU
router.post("/beerSku/delete", beersku_controller.beersku_delete_post);

// GET request for updating a beer SKU
router.get("/beerSku/update", beersku_controller.beersku_update_get);

// POST request for updating a beer SKU
router.post("/beerSku/update", beersku_controller.beersku_update_post);

// GET request for a single beer SKU detail
router.get("/beerSku/:id", beersku_controller.beersku_detail);

module.exports = router;
