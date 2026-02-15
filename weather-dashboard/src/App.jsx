import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ErrorMessage from './components/ErrorMessage';
import RecentSearches from './components/RecentSearches';
import UnitToggle from './components/UnitToggle';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [recentSearches, setRecentSearches] = useState([]);
  const [lastCity, setLastCity] = useState('');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (city) => {
    const updated = [city, ...recentSearches.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Fetch weather data
  const fetchWeather = async (city) => {
    if (!city) return;
    
    setLoading(true);
    setError(null);
    setLastCity(city);

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: unit
        }
      });
      
      setWeatherData(response.data);
      saveRecentSearch(city);
    } catch (err) {
      console.error('Error fetching weather:', err);
      
      if (err.response?.status === 404) {
        setError(`City "${city}" not found. Please check the spelling and try again.`);
      } else if (err.response?.status === 401) {
        setError('Invalid API key. Please check your configuration.');
      } else {
        setError('Failed to fetch weather data. Please try again later.');
      }
      
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle unit toggle
  const handleUnitToggle = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    
    // Refresh weather data with new unit if we have a city
    if (lastCity) {
      fetchWeather(lastCity);
    }
  };

  // Handle manual refresh
  const handleRefresh = () => {
    if (lastCity) {
      fetchWeather(lastCity);
    }
  };

  // Get user's location on load (Stretch Goal)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await axios.get(BASE_URL, {
              params: {
                lat: latitude,
                lon: longitude,
                appid: API_KEY,
                units: unit
              }
            });
            
            setWeatherData(response.data);
            setLastCity(response.data.name);
            saveRecentSearch(response.data.name);
          } catch (err) {
            console.error('Error fetching weather for location:', err);
          }
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to a major city if geolocation fails
          fetchWeather('London');
        }
      );
    } else {
      fetchWeather('London');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <svg 
                className="h-8 w-8 text-blue-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" 
                />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800">Weather Dashboard</h1>
            </div>
            
            <UnitToggle unit={unit} onToggle={handleUnitToggle} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onSearch={fetchWeather} isLoading={loading} />
          <RecentSearches 
            searches={recentSearches} 
            onSelectCity={fetchWeather}
          />
        </div>

        {/* Weather Display Section */}
        <div className="mt-8">
          {error && <ErrorMessage message={error} onRetry={() => lastCity && fetchWeather(lastCity)} />}
          
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
          )}

          {weatherData && !loading && (
            <WeatherCard 
              weatherData={weatherData} 
              unit={unit}
              onRefresh={handleRefresh}
            />
          )}

          {!weatherData && !loading && !error && (
            <div className="text-center py-16">
              <svg 
                className="mx-auto h-24 w-24 text-gray-400 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" 
                />
              </svg>
              <p className="text-gray-500 text-xl">Search for a city to see weather information</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600">
            Data provided by OpenWeatherMap • Weather Dashboard © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;