const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");
const citySelect = document.getElementById("city");
const latLonCheckbox = document.getElementById("autofill-checkbox");

const stateLatLon = {};

document.addEventListener("DOMContentLoaded", async function () {
  // Load countries and set the selected country
  await loadCountries();

  // Trigger change on countrySelect to load states and ensure it completes
  if (countrySelect.dataset.country) {
    await loadStates(countrySelect.value);
    // Once states are loaded and if a state is pre-selected, load cities
    if (stateSelect.dataset.state) {
      await Promise.all([
        loadStateLatLon(countrySelect.value, stateSelect.value),
        loadCities(countrySelect.value, stateSelect.value),
      ]);
    }
  }
});

countrySelect.addEventListener("change", async function () {
  clearStateSelect();
  clearCitySelect();
  clearLatLonInputs();
  await loadStates(countrySelect.value);
});

stateSelect.addEventListener("change", async function () {
  clearCitySelect();
  clearLatLonInputs();

  await Promise.all([
    loadStateLatLon(countrySelect.value, stateSelect.value),
    loadCities(countrySelect.value, stateSelect.value),
  ]);

  // Handle state change for autofill latitude and longitude
  if (latLonCheckbox.checked) {
    document.getElementById("latitude_deg").value = stateLatLon["latitude"];
    document.getElementById("longitude_deg").value = stateLatLon["longitude"];
  }
});

latLonCheckbox.addEventListener("change", async function () {
  const latitudeInput = document.getElementById("latitude_deg");
  const longitudeInput = document.getElementById("longitude_deg");
  if (this.checked && stateLatLon["latitude"] && stateLatLon["longitude"]) {
    latitudeInput.value = stateLatLon["latitude"];
    longitudeInput.value = stateLatLon["longitude"];
  } else {
    latitudeInput.value = "";
    longitudeInput.value = "";
  }
});

async function loadCountries() {
  const response = await fetch("/locations/countries");
  const countries = await response.json();
  countries.forEach((country) => {
    const option = new Option(country.name, country.iso2);
    option.selected = country.iso2 === countrySelect.dataset.country;
    countrySelect.add(option);
  });
}

async function loadStates(countryIso2) {
  const response = await fetch(`/locations/countries/${countryIso2}/states`);
  const states = await response.json();
  stateSelect.innerHTML = "<option value=''>--Please select a state--</option>";
  states.forEach((state) => {
    const option = new Option(state.name, state.iso2);
    option.selected = state.iso2 === stateSelect.dataset.state;
    stateSelect.add(option);
  });
}

async function loadCities(countryIso2, stateIso2) {
  const response = await fetch(
    `/locations/countries/${countryIso2}/states/${stateIso2}/cities`
  );
  const cities = await response.json();
  clearCitySelect();
  cities.forEach((city) => {
    const option = new Option(city.name, city.name);
    option.selected = city.name === citySelect.dataset.city;
    citySelect.add(option);
  });
}

async function loadStateLatLon(countryIso2, stateIso2) {
  const response = await fetch(
    `/locations/countries/${countryIso2}/states/${stateIso2}`
  );
  const stateDetails = await response.json();
  stateLatLon["latitude"] = stateDetails.latitude;
  stateLatLon["longitude"] = stateDetails.longitude;
}

function clearStateSelect() {
  stateSelect.innerHTML = "<option value=''>--Please select a state--</option>";
}

function clearCitySelect() {
  citySelect.innerHTML = "<option value=''>--Please select a city--</option>";
}

function clearLatLonInputs() {
  document.getElementById("latitude_deg").value = "";
  document.getElementById("longitude_deg").value = "";
}
