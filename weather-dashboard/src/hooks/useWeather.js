// src/hooks/useWeather.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useWeather = (location, unit) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (!location) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let url;
      // Check if location is coordinates (has lat and lon)
      if (typeof location === 'object' && location.lat && location.lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=${unit}`;
      } else {
        // Otherwise treat as city name
        url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=${unit}`;
      }
      
      const response = await axios.get(url);
      setData(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch weather data';
      setError(errorMessage);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [location, unit]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const refetch = useCallback(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { data, isLoading, error, refetch };
};