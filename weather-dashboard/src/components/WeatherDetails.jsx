import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWeather } from '../hooks/useWeather';
import WeatherCard from './WeatherCard';
import ErrorMessage from './ErrorMessage';

const WeatherDetails = () => {
  const { city } = useParams();
  const { data: weatherData, isLoading, error, refetch } = useWeather(city);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          message={error?.message || 'Failed to load weather data'} 
          onRetry={refetch}
        />
        <div className="text-center mt-4">
          <Link to="/" className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Navigation */}
      <Link 
        to="/" 
        className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6 font-medium transition-transform hover:-translate-x-1"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Main Card */}
      <WeatherCard 
        weatherData={weatherData} 
        unit="metric"
        onRefresh={refetch}
        detailed={true}
      />

      {/* 3-Column Responsive Grid for Health & Environment */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Health Metrics Card (AQI & UV) */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-md border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Environment</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-gray-600 dark:text-gray-300 font-medium">UV Index</span>
                <span className="text-orange-500 font-bold">High</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[70%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Air Quality</span>
                <span className="text-green-500 font-bold">Good</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[20%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats Card */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-md border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Atmosphere</h3>
          <div className="space-y-4">
            <StatRow label="Pressure" value={`${weatherData.main.pressure} hPa`} />
            <StatRow label="Visibility" value={`${(weatherData.visibility / 1000).toFixed(1)} km`} />
            <StatRow label="Cloudiness" value={`${weatherData.clouds.all}%`} />
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-md border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Location</h3>
          <div className="space-y-4">
            <StatRow label="Latitude" value={`${weatherData.coord.lat}°`} />
            <StatRow label="Longitude" value={`${weatherData.coord.lon}°`} />
            <div className="pt-2">
               <button className="w-full py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                 View on Map
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper component for clean rows
const StatRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-2">
    <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
    <span className="text-gray-800 dark:text-white font-semibold">{value}</span>
  </div>
);

export default WeatherDetails;