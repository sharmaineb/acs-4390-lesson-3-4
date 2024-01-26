// challenge 11
// require dotenv and call config
require('dotenv').config();

const fetch = require('node-fetch');

const express = require('express');
const cors = require('cors'); // Import the cors module

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// create an express app
const app = express();

app.use(cors()); // Use cors middleware

// build Schema
const schema = buildSchema(`
  enum Units {
    standard
    metric
    imperial
  }

  input CoordinatesInput {
    lon: Float
    lat: Float
  }

  type Weather {
    temperature: Float
    description: String
    feels_like: Float
    temp_min: Float
    temp_max: Float
    pressure: Int
    humidity: Int
  }

  type WeatherResult {
    weather: Weather
    cod: Int
    message: String
  }

  type Query {
    getWeatherByZip(zip: Int!, units: Units): WeatherResult!
    getWeatherByCity(city: String!, units: Units): WeatherResult!
    getWeatherByCityId(cityId: Int!, units: Units): WeatherResult!
    getWeatherByCoordinates(coordinates: CoordinatesInput!, units: Units): WeatherResult!
  }
`);


// set up resolver
const root = {
  getWeatherByZip: async ({ zip, units = 'imperial' }) => {
    try {
      const apikey = process.env.OPENWEATHERMAP_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apikey}&units=${units}`;
      return handleWeatherRequest(url);
    } catch (error) {
      return handleWeatherError();
    }
  },

  getWeatherByCity: async ({ city, units = 'imperial' }) => {
    const apikey = process.env.OPENWEATHERMAP_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apikey}&units=${units}`;
    return handleWeatherRequest(url);
  },

  getWeatherByCityId: async ({ cityId, units = 'imperial' }) => {
    const apikey = process.env.OPENWEATHERMAP_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apikey}&units=${units}`;
    return handleWeatherRequest(url);
  },

  getWeatherByCoordinates: async ({ coordinates, units = 'imperial' }) => {
    try {
      const { lat, lon } = coordinates;
      const apikey = process.env.OPENWEATHERMAP_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=${units}`;
      return handleWeatherRequest(url);
    } catch (error) {
      return handleWeatherError();
    }
  },
};

// helper function to handle weather requests
const handleWeatherRequest = async (url) => {
  try {
    const res = await fetch(url);
    const json = await res.json();

    if (json.cod === 404) {
      return handleWeatherError('City not found', 404);
    } else if (json.cod !== 200) {
      throw new Error(`OpenWeatherMap API error: ${json.message}`);
    }

    const weatherData = {
      temperature: json.main.temp,
      description: json.weather[0].description,
      feels_like: json.main.feels_like,
      temp_min: json.main.temp_min,
      temp_max: json.main.temp_max,
      pressure: json.main.pressure,
      humidity: json.main.humidity,
    };

    return {
      weather: weatherData,
      cod: json.cod,
      message: null,
    };
  } catch (error) {
    return handleWeatherError('Failed to fetch weather data');
  }
};

// helper function to handle weather errors
const handleWeatherError = (message = 'Failed to fetch weather data', cod = null) => {
  return {
    weather: {
      temperature: null,
      description: null,
      feels_like: null,
      temp_min: null,
      temp_max: null,
      pressure: null,
      humidity: null,
    },
    cod,
    message,
  };
};

// define a route for GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

// start the app
const port = 4000;
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});