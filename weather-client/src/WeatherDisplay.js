import React from 'react';

const WeatherDisplay = ({ temperature, description, feels_like, temp_min, temp_max, pressure, humidity }) => {
  return (
    <div className="WeatherDisplay">
      <h2>Weather Information</h2>
      <p>Temperature: {temperature}</p>
      <p>Description: {description}</p>
      <p>Feels Like: {feels_like !== null ? feels_like : 'N/A'}</p>
      <p>Min Temperature: {temp_min !== null ? temp_min : 'N/A'}</p>
      <p>Max Temperature: {temp_max !== null ? temp_max : 'N/A'}</p>
      <p>Pressure: {pressure !== null ? pressure : 'N/A'}</p>
      <p>Humidity: {humidity !== null ? humidity : 'N/A'}</p>
    </div>
  );
};

export default WeatherDisplay;