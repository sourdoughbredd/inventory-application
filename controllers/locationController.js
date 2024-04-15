const asyncHandler = require("express-async-handler");

const headers = new Headers();
headers.append("X-CSCAPI-KEY", process.env.LOCATION_API_KEY);

const requestOptions = {
  method: "GET",
  headers: headers,
  redirect: "follow",
};

exports.get_countries = asyncHandler(async (req, res, next) => {
  const response = await fetch(
    "https://api.countrystatecity.in/v1/countries",
    requestOptions
  );
  const data = await response.json();
  res.json(data);
});

exports.get_states_by_country = asyncHandler(async (req, res, next) => {
  const response = await fetch(
    `https://api.countrystatecity.in/v1/countries/${req.params.countryIso2}/states`,
    requestOptions
  );
  const data = await response.json();
  data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  res.json(data);
});

exports.get_cities_by_state = asyncHandler(async (req, res, next) => {
  const response = await fetch(
    `https://api.countrystatecity.in/v1/countries/${req.params.countryIso2}/states/${req.params.stateIso2}/cities`,
    requestOptions
  );
  const data = await response.json();
  res.json(data);
});

exports.get_state_details = asyncHandler(async (req, res, next) => {
  const response = await fetch(
    `https://api.countrystatecity.in/v1/countries/${req.params.countryIso2}/states/${req.params.stateIso2}`,
    requestOptions
  );
  const data = await response.json();
  res.json(data);
});
