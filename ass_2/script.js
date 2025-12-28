const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const statusEl = document.getElementById("status");
const resultsSection = document.getElementById("results");

const cityNameEl = document.getElementById("city-name");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const feelsLikeEl = document.getElementById("feels-like");
const windSpeedEl = document.getElementById("wind-speed");
const coordinatesEl = document.getElementById("coordinates");
const rainVolumeEl = document.getElementById("rain-volume");
const countryCodeEl = document.getElementById("country-code");

const countryNameEl = document.getElementById("country-name");
const countryCapitalEl = document.getElementById("country-capital");
const countryRegionEl = document.getElementById("country-region");
const countryPopulationEl = document.getElementById("country-population");
const countryCurrenciesEl = document.getElementById("country-currencies");
const flagWrapperEl = document.getElementById("country-flag-wrapper");
const flagImgEl = document.getElementById("country-flag");

const factsCardEl = document.getElementById("facts-card");
const factsListEl = document.getElementById("facts-list");
const factsUnavailableEl = document.getElementById("facts-unavailable");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    showStatus("Please enter a city name.", "error");
    return;
  }

  resultsSection.hidden = true;
  showStatus("Fetching data from the server…", "loading");

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Unable to fetch data from the server.");
    }

    const data = await response.json();
    renderWeather(data.weather);
    renderCountry(data.country);
    renderFacts(data.facts);

    resultsSection.hidden = false;
    showStatus(`Showing results for "${city}".`, "success");
  } catch (error) {
    console.error(error);
    showStatus(error.message, "error");
  }
});

function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = type;
}

function renderWeather(weather) {
  if (!weather) {
    return;
  }

  cityNameEl.textContent = `${weather.city}, ${weather.countryCode}`;
  temperatureEl.innerHTML = `${Math.round(weather.temperature)}°C <span>current</span>`;
  descriptionEl.textContent = weather.description;
  feelsLikeEl.textContent = `${Math.round(weather.feelsLike)}°C`;
  windSpeedEl.textContent = `${weather.windSpeed} m/s`;
  coordinatesEl.textContent = `${weather.coordinates.lat.toFixed(
    2
  )}, ${weather.coordinates.lon.toFixed(2)}`;
  rainVolumeEl.textContent = `${weather.rainLast3h} mm`;
  countryCodeEl.textContent = weather.countryCode;
}

function renderCountry(country) {
  if (!country) {
    countryNameEl.textContent = "No additional country details available.";
    countryCapitalEl.textContent = "";
    countryRegionEl.textContent = "";
    countryPopulationEl.textContent = "";
    countryCurrenciesEl.textContent = "";
    flagWrapperEl.hidden = true;
    return;
  }

  countryNameEl.textContent = `Country: ${country.name}`;
  countryCapitalEl.textContent = country.capital
    ? `Capital: ${country.capital}`
    : "Capital: Not available";
  countryRegionEl.textContent = `Region: ${country.region}`;
  countryPopulationEl.textContent = `Population: ${country.population.toLocaleString()}`;

  if (country.currencies && country.currencies.length > 0) {
    countryCurrenciesEl.textContent = `Currencies: ${country.currencies.join(", ")}`;
  } else {
    countryCurrenciesEl.textContent = "Currencies: Not available";
  }

  if (country.flagPng) {
    flagImgEl.src = country.flagPng;
    flagImgEl.alt = `${country.name} flag`;
    flagWrapperEl.hidden = false;
  } else {
    flagWrapperEl.hidden = true;
  }
}

function renderFacts(facts) {
  if (!facts || !facts.items || facts.items.length === 0) {
    factsCardEl.hidden = true;
    factsUnavailableEl.hidden = false;
    return;
  }

  factsCardEl.hidden = false;
  factsUnavailableEl.hidden = true;
  factsListEl.innerHTML = "";

  facts.items.forEach((fact) => {
    const factEl = document.createElement("div");
    factEl.className = "fact-item";

    const factTextEl = document.createElement("p");
    factTextEl.className = "fact-text";
    factTextEl.textContent = fact.text;

    const factCategoryEl = document.createElement("span");
    factCategoryEl.className = "fact-category";
    factCategoryEl.textContent = fact.category || "General";

    factEl.appendChild(factTextEl);
    factEl.appendChild(factCategoryEl);

    factsListEl.appendChild(factEl);
  });
}


