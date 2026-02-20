import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import WeatherCard from './WeatherCard';
import ErrorMessage from './ErrorMessage';
import RecentSearches from './RecentSearches';
import UnitToggle from './UnitToggle';
import { useWeather } from '../hooks/useWeather';
import { useThemeContext } from '../context/ThemeContext';

const HomePage = () => {
  const [city, setCity] = useState('London');
  const [unit, setUnit] = useState('metric');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSunAlert, setShowSunAlert] = useState(false);
  
  const { data: weatherData, isLoading, error, refetch } = useWeather(city, unit);
  const { isDark, toggleTheme } = useThemeContext();

  // Sunlight Detection Logic
  useEffect(() => {
    if (weatherData && !isDark) {
      const isSunny = weatherData.weather[0].main === 'Clear';
      const isHot = weatherData.main.temp > 28; 

      if (isSunny && isHot) {
        setShowSunAlert(true);
        // Auto-hide alert after 10 seconds
        const timer = setTimeout(() => setShowSunAlert(false), 10000);
        return () => clearTimeout(timer);
      }
    }
  }, [weatherData, isDark]);

  const handleSearch = (newCity) => {
    setCity(newCity);
    const updated = [newCity, ...recentSearches.filter(c => c !== newCity)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleUnitToggle = () => {
    setUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 transition-colors duration-500">
      
      {/* Sunlight Notification Toast */}
      {showSunAlert && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 shadow-lg rounded-lg flex items-center gap-3">
            <span className="text-xl">☀️</span>
            <div>
              <p className="font-bold">Bright Sunlight Detected!</p>
              <button 
                onClick={() => { toggleTheme(); setShowSunAlert(false); }}
                className="text-sm underline font-semibold"
              >
                Switch to Dark Mode for better contrast?
              </button>
            </div>
            <button onClick={() => setShowSunAlert(false)} className="ml-2 text-yellow-900">&times;</button>
          </div>
        </div>
      )}

      {/* Search Section: Responsive margins */}
      <div className="mb-8 space-y-4">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        <RecentSearches 
          searches={recentSearches} 
          onSelectCity={handleSearch}
        />
      </div>

      {/* Unit Toggle & Refresh Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold dark:text-white">
          Current Weather
        </h2>
        <UnitToggle unit={unit} onToggle={handleUnitToggle} />
      </div>

      {/* Weather Display */}
      <div className="mt-4">
        {error && (
          <ErrorMessage 
            message={error.message} 
            onRetry={() => refetch()} 
          />
        )}
        
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 animate-pulse">Fetching sky data...</p>
          </div>
        )}

        {weatherData && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <WeatherCard 
              weatherData={weatherData} 
              unit={unit}
              onRefresh={refetch}
            />
          </div>
        )}

        {!weatherData && !isLoading && !error && (
          <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Enter a city name to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;