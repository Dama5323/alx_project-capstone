import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getCurrentWeather = (city, unit = 'metric') => {
  return axios.get(`${BASE_URL}/weather`, { params: { q: city, appid: API_KEY, units: unit } });
};

export const getForecast = (city, unit = 'metric') => {
  return axios.get(`${BASE_URL}/forecast`, { params: { q: city, appid: API_KEY, units: unit } });
};// src/services/weatherService.js
export const fetchWeatherByCoords = async (lat, lon, unit = 'metric') => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
    );
    return { data: response.data, error: null };
  } catch (err) {
    return { 
      data: null, 
      error: err.response?.data?.message || 'Failed to fetch weather data' 
    };
  }
};