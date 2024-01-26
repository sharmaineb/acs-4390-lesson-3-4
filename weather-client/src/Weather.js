import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { client } from './apollo';
import WeatherDisplay from './WeatherDisplay';
import './Weather.css'; 

const GET_WEATHER = gql`
  query GetWeather($zip: Int!) {
    getWeatherByZip(zip: $zip) {
      weather {
        temperature
        description
        feels_like
        temp_min
        temp_max
        pressure
        humidity
      }
      cod
      message
    }
  }
`;

const Weather = () => {
  const [zip, setZip] = useState('');
  const { loading, error, data } = useQuery(GET_WEATHER, {
    variables: { zip: parseInt(zip) || 0 },
    client: client,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // call the function to make the GraphQL query with the entered zip code
  };

  return (
    <div className="weather-container">
      <form onSubmit={handleSubmit} className="weather-form">
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="Enter ZIP code"
          className="zip-input"
        />
        <button type="submit" className="submit-button">
          Get Weather
        </button>
      </form>

      <div className="weather-results">
        {loading && <p>Loading...</p>}

        {error && <p className="error-message">Error: {error.message}</p>}

        {data && data.getWeatherByZip && data.getWeatherByZip.cod === 200 && (
          <WeatherDisplay {...data.getWeatherByZip.weather} />
        )}

        {data && data.getWeatherByZip && (data.getWeatherByZip.cod !== 200 && data.getWeatherByZip.cod !== null) && (
          <div>
            <p className="error-message">
              Error: {data.getWeatherByZip.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;