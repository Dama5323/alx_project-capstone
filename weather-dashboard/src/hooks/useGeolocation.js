// src/hooks/useGeolocation.js
import { useState, useEffect, useCallback } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState('');

  const getCurrentLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          // Reverse geocoding
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
          );
          
          const locationData = await response.json();
          
          if (locationData && locationData.length > 0) {
            setCityName(locationData[0].name);
          }
        } catch (err) {
          setError('Failed to get location details');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        let errorMessage = 'Unable to get your location. ';
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += 'Please enable location access.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'Please search for your city manually.';
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options
      }
    );
  }, [options]);

  return {
    location,
    error,
    loading,
    cityName,
    getCurrentLocation
  };
};