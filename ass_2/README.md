# Assignment 2: Weather & Location Dashboard

A full-stack web application that demonstrates **server-side API integration** using Node.js and Express. The server retrieves data from **OpenWeather API** and **Facts API**, then exposes a clean JSON API that the frontend consumes.

## Project Overview

This project fulfills the requirements for Assignment 2 by:
- Fetching weather data server-side from OpenWeather API
- Displaying all required weather fields (temperature, description, coordinates, feels-like, wind speed, country code, rain volume)
- Integrating an additional API (Facts API) for interesting facts about countries and cities
- Providing a clean, responsive, and user-friendly interface
- Following industry best practices with well-organized code structure

## Prerequisites

- **Node.js** version 18.0.0 or higher (for built-in `fetch` support)
- **npm** (Node Package Manager)
- **OpenWeather API Key** (free tier available at [openweathermap.org](https://openweathermap.org/api))
- **No API key required for Facts API** - it works without authentication!

## Setup Instructions

### 1. Install Dependencies

Navigate to the `ass_2` directory and install the required packages:

```bash
cd ass_2
npm install
```

This will install:
- `express` - Web framework for Node.js
- `dotenv` - Environment variable management

### 2. Configure Environment Variables

Create a `.env` file in the `ass_2` directory:

```bash
New-Item -Path .env -ItemType File
```

Add the following content to your `.env` file:

```env
# OpenWeather API Key (Required)
# Get  free API key from: https://openweathermap.org/api

# Server Port (Optional - defaults to 7777)
PORT=7777
```


### 3. Get API Keys

#### OpenWeather API Key (Required)
1. Visit [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys section
4. Copy your API key and paste it in the `.env` file

#### Facts API
- The Facts API works automatically without any API key! It uses:


### 4. Start the Server

```bash
npm start
```

The server will start on `http://localhost:7777` 

### 5. Open the Application

Open your web browser and navigate to:
```
http://localhost:7777
```

## API Usage Details

### Endpoint: `GET /api/weather?city={cityName}`

**Description:** Fetches real-time weather data for a city using the **OpenWeather API**, country details from **REST Countries API**, and interesting facts from **Facts API**. All external API calls are made server-side; the client only communicates with your Node server.

**Query Parameters:**
- `city` : The name of the city to get weather for (e.g., "Manila", "New York", "London")

**Example Request:**
```bash
GET http://localhost:7777/api/weather?city=Manila
```

**Response Structure:**
```json
{
  "weather": {
    "city": "Astana",
    "temperature": -15,
    "description": "broken clouds",
    "coordinates": {
      "lat": 51.18,
      "lon": 71.45
    },
    "feelsLike": -20,
    "windSpeed": 2,
    "countryCode": "KZ",
    "rainLast3h": 0
  },
  

}
```

**Error Responses:**
- `400 Bad Request`: Missing city parameter
- `404 Not Found`: City not found
- `401 Unauthorized`: Invalid API key
- `500 Internal Server Error`: Server error

### Health Check Endpoint: `GET /api/status`

Returns server status and timestamp.


## Project Structure

```
ass_2/
├── server.js          # Express server with API endpoints
├── package.json       # Dependencies and scripts
├── .env              # Environment variables (create this)
├── index.html        # Frontend HTML structure
├── style.css         # Responsive CSS styling
├── script.js         # Frontend JavaScript logic
└── README.md         # This file
```


## Key Features

### Weather Data Display
- Current temperature
- Weather description
- Geographic coordinates (latitude, longitude)
- Feels-like temperature
- Wind speed
- Country code
- Rain volume for last 3 hours

### Additional Features
- Country details
- Interesting facts about countries
- Real-time data fetching

## Testing

### Using the Web Interface
1. Start the server: `npm start`
2. Open `http://localhost:7777` in your browser
3. Enter a city name
4. Click "Get Weather" to see the results




