import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export const fetchForecast = async (city, unit = 'metric') => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: unit,
        cnt: 40 // Get 5 days of data (8 readings per day)
      }
    });
    
    return { data: response.data, error: null };
  } catch (err) {
    console.error('Forecast fetch error:', err);
    
    let errorMessage = 'Failed to fetch forecast data';
    if (err.response?.status === 404) {
      errorMessage = `City "${city}" not found`;
    } else if (err.response?.status === 401) {
      errorMessage = 'Invalid API key';
    }
    
    return { data: null, error: errorMessage };
  }
};