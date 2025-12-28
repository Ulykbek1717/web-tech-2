const express = require('express');
const path = require('path');
require('dotenv').config();

// Create Express application
const app = express();
const PORT = process.env.PORT || 7777;

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static(__dirname));


app.get('/', (req, res) => {
  // Send main HTML file to the browser
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/api/weather', async (req, res) => {
  // Get city from query string
  const city = req.query.city;

  // Validate city parameter
  if (!city) {
    return res.status(400).json({
      error: 'City parameter is required'
    });
  }

  // Read API key from .env file
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'OpenWeather API key is missing'
    });
  }

  try {
    /* Fetch weather data from OpenWeather API */
    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?q=${city}&appid=${apiKey}&units=metric`;

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      return res.status(404).json({
        error: 'City not found'
      });
    }

    const weatherData = await weatherResponse.json();

    // Extract only required weather fields
    const weather = {
      city: weatherData.name,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      coordinates: {
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon
      },
      feelsLike: weatherData.main.feels_like,
      windSpeed: weatherData.wind.speed,
      countryCode: weatherData.sys.country,
      rainLast3h: weatherData.rain?.['3h'] || 0
    };

    /* Fetch country information */
    let country = null;
    const countryCode = weatherData.sys.country;

    try {
      const countryResponse = await fetch(
        `https://restcountries.com/v3.1/alpha/${countryCode}`
      );

      if (countryResponse.ok) {
        const countryData = await countryResponse.json();
        const info = countryData[0];

        country = {
          name: info.name.common,
          capital: info.capital ? info.capital[0] : 'N/A',
          region: info.region,
          population: info.population,
          currencies: info.currencies 
            ? Object.keys(info.currencies) 
            : [],
          flagPng: info.flags?.png || null
        };
      }
    } catch (err) {
      // Ignore country errors and continue
    }

    /* Generate simple facts */
    let facts = [];

    if (country) {
      facts.push({
        text: `${country.name} is located in ${country.region}`,
        category: 'Geography'
      });
    }

    

    /* Send final response */
    res.json({
      weather: weather,
      country: country,
      facts: facts.length > 0 ? { items: facts } : null
    });

  } catch (error) {
    // Handle unexpected server errors
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
