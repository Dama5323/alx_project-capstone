import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const fetchWeather = async ({ queryKey }) => {
  const [, city, unit] = queryKey;
  
  if (!city) return null;
  
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: unit
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`City "${city}" not found. Please check the spelling.`);
    }
    throw new Error('Failed to fetch weather data. Please try again.');
  }
};

export const useWeather = (city, unit = 'metric') => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['weather', city, unit],
    queryFn: fetchWeather,
    enabled: !!city, // Only run if city is provided
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: 1, // Only retry once on failure
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  });

  const prefetchCity = async (cityToPrefetch) => {
    if (cityToPrefetch && cityToPrefetch !== city) {
      await queryClient.prefetchQuery({
        queryKey: ['weather', cityToPrefetch, unit],
        queryFn: fetchWeather,
        staleTime: 5 * 60 * 1000,
      });
    }
  };

  return {
    ...query,
    prefetchCity
  };
};