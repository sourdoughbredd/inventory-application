#! /usr/bin/env node

console.log(
  'This script populates some test data to our database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Beer = require("./models/beer");
const Brewery = require("./models/brewery");
const Type = require("./models/type");
const BeerSku = require("./models/beerSku");

const types = [];
const breweries = [];
const beers = [];
const beerSkus = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createTypes();
  await createBreweries();
  await createBeers();
  await createBeerSkus();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// type[0] will always be the ____ type, regardless of the order
// in which the elements of promise.all's argument complete.
async function typeCreate(index, name) {
  const type = new Type({ name: name });
  await type.save();
  types[index] = type;
  console.log(`Added type: ${name}`);
}

async function breweryCreate(
  index,
  name,
  description,
  city,
  state,
  country,
  location
) {
  const brewerydetail = { name };
  if (description != false) brewerydetail.description = description;
  if (city != false) brewerydetail.city = city;
  if (state != false) brewerydetail.state = state;
  if (country != false) brewerydetail.country = country;
  if (location != false) brewerydetail.location = location;

  const brewery = new Brewery(brewerydetail);

  await brewery.save();
  breweries[index] = brewery;
  console.log(`Added brewery: ${name}`);
}

async function beerCreate(
  index,
  name,
  brewery,
  type,
  abv,
  ibu,
  description,
  flavors
) {
  const beerdetail = { name, brewery, type, abv };
  if (ibu != false) beerdetail.ibu = ibu;
  if (description != false) beerdetail.description = description;
  if (flavors != false) beerdetail.flavors = flavors;

  const beer = new Beer(beerdetail);
  await beer.save();
  beers[index] = beer;
  console.log(`Added beer: ${name} ${brewery}`);
}

async function beerSkuCreate(index, beer, packaging, stock, price) {
  const beerSkudetail = { beer, packaging, stock, price };
  const beerSku = new BeerSku(beerSkudetail);
  await beerSku.save();
  beerSkus[index] = beerSku;
  console.log(`Added beerSku: ${beer}: ${packaging}`);
}

async function createTypes() {
  console.log("Adding types");
  await Promise.all([
    typeCreate(0, "IPA"),
    typeCreate(1, "Stout"),
    typeCreate(2, "Lager"),
    typeCreate(3, "Pilsner"),
    typeCreate(4, "Porter"),
    typeCreate(5, "Ale"),
    typeCreate(6, "Wheat Beer"),
    typeCreate(7, "Sour Beer"),
    typeCreate(8, "Belgian Beer"),
    typeCreate(9, "Pale Ale"),
  ]);
}

async function createBreweries() {
  console.log("Adding breweries");
  await Promise.all([
    breweryCreate(
      0,
      "Golden Brewery",
      "Famous for its lager beers.",
      "Golden",
      "Colorado",
      "USA",
      { type: "Point", coordinates: [39.7555, -105.2211] }
    ),
    breweryCreate(
      1,
      "Mountain Craft",
      "Specializes in craft ales and stouts.",
      "Asheville",
      "North Carolina",
      "USA",
      { type: "Point", coordinates: [35.5951, -82.5515] }
    ),
    breweryCreate(
      2,
      "River Ale House",
      "Known for riverfront views and pale ales.",
      "Portland",
      "Oregon",
      "USA",
      { type: "Point", coordinates: [45.5231, -122.6765] }
    ),
    breweryCreate(
      3,
      "Brewmasters International",
      "Wide selection of international beers.",
      "Brussels",
      "Brussels-Capital",
      "Belgium",
      { type: "Point", coordinates: [50.8503, 4.3517] }
    ),
    breweryCreate(
      4,
      "Old Town Brewery",
      "Historic brewery with a variety of classic styles.",
      "Dublin",
      "Dublin",
      "Ireland",
      { type: "Point", coordinates: [53.3498, -6.2603] }
    ),
    // Add more breweries as needed
  ]);
}

async function createBeers() {
  console.log("Adding beers");
  await Promise.all([
    beerCreate(
      0,
      "Golden Peak Lager",
      breweries[0],
      types[2],
      4.8,
      18,
      "A smooth, crisp lager with a golden hue.",
      ["malty", "smooth", "light"]
    ),
    beerCreate(
      1,
      "Mountain Stout",
      breweries[1],
      types[1],
      5.5,
      35,
      "A rich, full-bodied stout with coffee notes.",
      ["dark", "rich", "coffee"]
    ),
    beerCreate(
      2,
      "River Pale Ale",
      breweries[2],
      types[9],
      5.2,
      30,
      "A refreshing pale ale with a hoppy finish.",
      ["hoppy", "citrus", "bitter"]
    ),
    beerCreate(
      3,
      "Brussels Tripel",
      breweries[3],
      types[8],
      8.5,
      20,
      "A strong, spicy, and fruity Belgian ale.",
      ["strong", "spicy", "fruity"]
    ),
    beerCreate(
      4,
      "Dublin Porter",
      breweries[4],
      types[4],
      4.7,
      25,
      "A smooth, dark porter with chocolate undertones.",
      ["chocolate", "roasted", "smooth"]
    ),
    beerCreate(
      5,
      "Asheville Amber",
      breweries[1],
      types[5],
      5.6,
      25,
      "A smooth amber ale with a balanced malt profile.",
      ["malty", "balanced", "smooth"]
    ),
    beerCreate(
      6,
      "Golden IPA",
      breweries[0],
      types[0],
      6.3,
      55,
      "A hoppy IPA with a citrus punch.",
      ["hoppy", "citrus", "bitter"]
    ),
    beerCreate(
      7,
      "Craft Pilsner",
      breweries[1],
      types[3],
      4.9,
      20,
      "A light, crisp pilsner with a floral aroma.",
      ["light", "floral", "crisp"]
    ),
    beerCreate(
      8,
      "River Stout",
      breweries[2],
      types[1],
      6.0,
      40,
      "A dark stout with notes of chocolate and coffee.",
      ["chocolate", "coffee", "dark"]
    ),
    beerCreate(
      9,
      "Belgian Blonde",
      breweries[3],
      types[8],
      6.5,
      22,
      "A light, fruity blonde ale with a spicy yeast character.",
      ["fruity", "light", "spicy"]
    ),
    beerCreate(
      10,
      "Dublin Red Ale",
      breweries[4],
      types[5],
      4.7,
      18,
      "A rich, malty red ale with a caramel finish.",
      ["malty", "caramel", "rich"]
    ),
    beerCreate(
      11,
      "Golden Wheat",
      breweries[0],
      types[6],
      5.0,
      15,
      "A smooth wheat beer with hints of citrus and coriander.",
      ["citrus", "coriander", "smooth"]
    ),
    beerCreate(
      12,
      "Craft IPA",
      breweries[1],
      types[0],
      7.2,
      60,
      "A strong IPA with a bold hop profile and pine notes.",
      ["hoppy", "pine", "strong"]
    ),
    beerCreate(
      13,
      "Portland Sour",
      breweries[2],
      types[7],
      4.5,
      12,
      "A tart and refreshing sour beer with berry overtones.",
      ["tart", "berry", "refreshing"]
    ),
    beerCreate(
      14,
      "Brussels Saison",
      breweries[3],
      types[8],
      7.0,
      25,
      "A traditional saison with earthy tones and a dry finish.",
      ["earthy", "dry", "traditional"]
    ),
    // Add more beers as needed
  ]);
}

async function createBeerSkus() {
  console.log("Adding beer SKUs");
  await Promise.all([
    // For Beer 0
    beerSkuCreate(
      0,
      beers[0]._id,
      { type: "Bottle", volume_oz: 12, volume_ml: 355, quantity: 6 },
      100,
      9.99
    ),
    // For Beer 1
    beerSkuCreate(
      1,
      beers[1]._id,
      { type: "Can", volume_oz: 12, volume_ml: 355, quantity: 4 },
      150,
      8.99
    ),
    beerSkuCreate(
      2,
      beers[1]._id,
      { type: "Growler", volume_oz: 64, volume_ml: 1893, quantity: 1 },
      50,
      22.99
    ),
    // For Beer 2
    beerSkuCreate(
      3,
      beers[2]._id,
      { type: "Mini-Keg", volume_oz: 169, volume_ml: 5000, quantity: 1 },
      30,
      35.99
    ),

    // For Beer 3
    beerSkuCreate(
      4,
      beers[3]._id,
      { type: "Bottle", volume_oz: 22, volume_ml: 650, quantity: 1 },
      80,
      12.99
    ),
    beerSkuCreate(
      5,
      beers[3]._id,
      { type: "Keg", volume_oz: 1984, volume_ml: 58753, quantity: 1 },
      10,
      99.99
    ),

    // Continue for other beers
    beerSkuCreate(
      6,
      beers[4]._id,
      { type: "Can", volume_oz: 16, volume_ml: 473, quantity: 6 },
      120,
      14.99
    ),
    beerSkuCreate(
      7,
      beers[5]._id,
      { type: "Growler", volume_oz: 32, volume_ml: 946, quantity: 1 },
      75,
      18.99
    ),
    beerSkuCreate(
      8,
      beers[6]._id,
      { type: "Mini-Keg", volume_oz: 84, volume_ml: 2485, quantity: 1 },
      25,
      29.99
    ),
    beerSkuCreate(
      9,
      beers[7]._id,
      { type: "Can", volume_oz: 12, volume_ml: 355, quantity: 6 },
      180,
      9.49
    ),
    beerSkuCreate(
      10,
      beers[8]._id,
      { type: "Bottle", volume_oz: 22, volume_ml: 650, quantity: 1 },
      75,
      13.99
    ),
    beerSkuCreate(
      11,
      beers[9]._id,
      { type: "Keg", volume_oz: 1984, volume_ml: 58753, quantity: 1 },
      20,
      199.99
    ),
    beerSkuCreate(
      12,
      beers[10]._id,
      { type: "Can", volume_oz: 12, volume_ml: 355, quantity: 6 },
      110,
      11.49
    ),
    beerSkuCreate(
      13,
      beers[11]._id,
      { type: "Growler", volume_oz: 64, volume_ml: 1893, quantity: 1 },
      60,
      24.99
    ),
    beerSkuCreate(
      14,
      beers[12]._id,
      { type: "Mini-Keg", volume_oz: 169, volume_ml: 5000, quantity: 1 },
      40,
      49.99
    ),
    beerSkuCreate(
      15,
      beers[13]._id,
      { type: "Bottle", volume_oz: 22, volume_ml: 650, quantity: 1 },
      85,
      15.99
    ),
    beerSkuCreate(
      16,
      beers[14]._id,
      { type: "Keg", volume_oz: 1984, volume_ml: 58753, quantity: 1 },
      15,
      249.99
    ),
  ]);
}

// Assuming beerSkuCreate is already defined
