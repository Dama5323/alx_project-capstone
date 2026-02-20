import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Components
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ErrorMessage from './components/ErrorMessage';
import RecentSearches from './components/RecentSearches';
import UnitToggle from './components/UnitToggle';
import WeatherDetails from './components/WeatherDetails';
import Settings from './components/Settings';
import Favorites from './components/Favorites';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header'; 
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ProfilePage from './components/profile/ProfilePage';

// Context
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Create QueryClient outside of component to prevent re-creation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  },
});

// Home Page Component
const HomePage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric');
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

  // Get user's location on load
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
            fetchWeather('London');
          }
        },
        (error) => {
          console.log('Geolocation error:', error);
          fetchWeather('London');
        }
      );
    } else {
      fetchWeather('London');
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Unit Toggle - Moved to top right */}
      <div className="flex justify-end mb-4">
        <UnitToggle unit={unit} onToggle={handleUnitToggle} />
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <SearchBar onSearch={fetchWeather} isLoading={loading} />
        <RecentSearches 
          searches={recentSearches} 
          onSelectCity={fetchWeather}
        />
      </div>

      {/* Weather Display Section */}
      <div className="mt-4">
        {error && <ErrorMessage message={error} onRetry={() => lastCity && fetchWeather(lastCity)} />}
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <svg 
              className="mx-auto h-16 w-16 text-gray-400 mb-3" 
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
            <p className="text-gray-500 text-lg">Search for a city to see weather information</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Root App with Providers
// Root App with Providers
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider> 
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
              {/* Use the Header component here */}
              <Header />
              
              <main className="container mx-auto px-4 py-4">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/weather/:city" element={<WeatherDetails />} />
                  <Route path="/favorites" element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  } />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
              </main>

              <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-8 py-4 transition-colors">
                <div className="container mx-auto px-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Data provided by OpenWeatherMap • Weather Dashboard © 2026
                  </p>
                </div>
              </footer>
            </div>
          </Router>
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider> {/* This was misplaced */}
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;