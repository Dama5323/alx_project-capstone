import React, { useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import WeatherCard from './WeatherCard';
import WeatherSearchForm from './WeatherSearchForm';
import ErrorMessage from './ErrorMessage';
import { useQueryClient } from '@tanstack/react-query';

const WeatherDashboard = () => {
  const [city, setCity] = useState('London');
  const [unit, setUnit] = useState('metric');
  const queryClient = useQueryClient();
  
  const { 
    data: weatherData, 
    isLoading, 
    error, 
    refetch,
    isFetching,
    dataUpdatedAt 
  } = useWeather(city, unit);

  const handleSearch = (newCity, newUnit) => {
    setCity(newCity);
    setUnit(newUnit);
  };

  const handleRefresh = () => {
    // Invalidate and refetch
    queryClient.invalidateQueries(['weather', city, unit]);
    refetch();
  };

  const handlePrefetch = (cityToPrefetch) => {
    // Optional: Prefetch when hovering over recent searches
    const { prefetchCity } = useWeather(cityToPrefetch, unit);
    prefetchCity(cityToPrefetch);
  };

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <WeatherSearchForm onSearch={handleSearch} isLoading={isLoading || isFetching} />
      </div>

      {error && (
        <ErrorMessage 
          message={error.message} 
          onRetry={handleRefresh}
        />
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      )}

      {weatherData && !isLoading && (
        <>
          <WeatherCard 
            weatherData={weatherData} 
            unit={unit}
            onRefresh={handleRefresh}
            lastUpdated={lastUpdated}
          />
          
          {/* Cache status indicator */}
          <div className="mt-4 text-center">
            <span className="text-xs text-gray-500">
              {isFetching ? '🔄 Updating...' : '✅ Data from cache'}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherDashboard;