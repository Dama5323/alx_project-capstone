import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar';  
import WeatherCard from '../components/WeatherCard';  
import ErrorMessage from '../components/ErrorMessage';  
import RecentSearches from '../components/RecentSearches';  
import UnitToggle from '../components/UnitToggle';  
import ForecastChart from '../components/ForecastChart';  
import { useWeather } from '../hooks/useWeather';
import { useThemeContext } from '../context/ThemeContext';
import { fetchForecast } from '../services/forecastService';



const HomePage = () => {
  // 1. State Management
  const [city, setCity] = useState('Nairobi'); // Default city
  const [unit, setUnit] = useState('metric');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSunAlert, setShowSunAlert] = useState(false);
  
  // IMPORTANT: Add forecast specific state
  const [forecastData, setForecastData] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState(null);

  // 2. Custom Hooks & Context
  const { data: weatherData, isLoading, error, refetch } = useWeather(city, unit);
  const { isDark, toggleTheme } = useThemeContext();

  // 3. IMPORTANT: Add this function to fetch forecast data
  const fetchForecastData = useCallback(async (cityName, currentUnit) => {
    if (!cityName) return;
    
    setForecastLoading(true);
    setForecastError(null);
    
    try {
      // Use your forecast service to fetch 5-day forecast
      const { data, error } = await fetchForecast(cityName, currentUnit);
      
      if (error) {
        setForecastError(error);
        setForecastData(null);
      } else {
        setForecastData(data);
      }
    } catch (err) {
      setForecastError('Failed to fetch forecast data');
      setForecastData(null);
    } finally {
      setForecastLoading(false);
    }
  }, []);

  // 4. IMPORTANT: Add this effect to fetch forecast when city/unit changes
  useEffect(() => {
    if (city) {
      fetchForecastData(city, unit);
    }
  }, [city, unit, fetchForecastData]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  // Sunlight Detection Logic
  useEffect(() => {
    if (weatherData && !isDark) {
      const isSunny = weatherData.weather[0].main === 'Clear';
      const isHot = unit === 'metric' ? weatherData.main.temp > 28 : weatherData.main.temp > 82;

      if (isSunny && isHot) {
        setShowSunAlert(true);
        const timer = setTimeout(() => setShowSunAlert(false), 8000);
        return () => clearTimeout(timer);
      }
    }
  }, [weatherData, isDark, unit]);

  // 5. Event Handlers
  const handleSearch = (newCity) => {
    setCity(newCity);
    
    // Update Recent Searches
    const updated = [newCity, ...recentSearches.filter(c => c !== newCity)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleUnitToggle = () => {
    setUnit(prev => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const handleRefresh = () => {
    refetch(); // Refetches current weather
    fetchForecastData(city, unit); // Refetches forecast
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 transition-colors duration-500">
      
      {/* Sunlight Notification Toast */}
      {showSunAlert && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-bounce">
          <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-900 p-4 shadow-2xl rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">☀️</span>
              <div>
                <p className="font-bold text-sm">Bright Sunlight Detected!</p>
                <button 
                  onClick={() => { toggleTheme(); setShowSunAlert(false); }}
                  className="text-xs underline font-bold text-amber-700 hover:text-amber-900"
                >
                  Switch to Dark Mode for better contrast?
                </button>
              </div>
            </div>
            <button onClick={() => setShowSunAlert(false)} className="text-xl font-bold">&times;</button>
          </div>
        </div>
      )}

      {/* Search Section */}
      <section className="mb-8 space-y-4">
        <SearchBar onSearch={handleSearch} isLoading={isLoading || forecastLoading} />
        <RecentSearches searches={recentSearches} onSelectCity={handleSearch} />
      </section>

      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black tracking-tight dark:text-white">
          Weekly Dashboard
        </h2>
        <UnitToggle unit={unit} onToggle={handleUnitToggle} />
      </div>

      {/* Main Content Area */}
      <main className="space-y-8">
        {/* Error States */}
        {error && <ErrorMessage message={error} onRetry={handleRefresh} />}

        {/* Loading States */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-64 gap-4 bg-white/20 dark:bg-white/5 rounded-3xl backdrop-blur-md">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Analyzing the atmosphere...</p>
          </div>
        )}

        {/* Weather Display */}
        {weatherData && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <WeatherCard 
              weatherData={weatherData} 
              unit={unit}
              onRefresh={handleRefresh}
            />
            
            {/* IMPORTANT: Add this section for forecast */}
            <section className="mt-10">
              <h3 className="text-xl font-bold mb-4 dark:text-white px-2">
                5-Day Forecast
              </h3>
              
              {forecastLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-pulse flex space-x-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-32 h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    ))}
                  </div>
                </div>
              ) : forecastError ? (
                <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl text-center text-red-600 dark:text-red-400">
                  <p className="font-semibold">Forecast Error: {forecastError}</p>
                </div>
              ) : (
                forecastData && <ForecastChart forecastData={forecastData} unit={unit} />
              )}
            </section>
          </div>
        )}

        {/* Empty State */}
        {!weatherData && !isLoading && !error && (
          <div className="text-center py-20 bg-gray-100/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Search for a city to see the weekly forecast</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;