// src/services/forecastService.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export const fetchForecast = async (location, unit = 'metric') => {
  try {
    let url;
    // Check if location is coordinates
    if (typeof location === 'object' && location.lat && location.lon) {
      url = `${BASE_URL}?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=${unit}&cnt=40`;
    } else {
      // Clean city name if it's a string
      const cleanedCity = location.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();
      url = `${BASE_URL}?q=${cleanedCity}&appid=${API_KEY}&units=${unit}&cnt=40`;
    }
    
    const response = await axios.get(url);
    return { data: response.data, error: null };
  } catch (err) {
    console.error('Forecast fetch error:', err);
    
    let errorMessage = 'Failed to fetch forecast data';
    if (err.response?.status === 404) {
      errorMessage = `Location not found. Please check the spelling.`;
    } else if (err.response?.status === 401) {
      errorMessage = 'Invalid API key';
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    return { data: null, error: errorMessage };
  }
};