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
import NotificationCenter from '../components/NotificationCenter';
import OutfitAdvisor from '../components/OutfitAdvisor';
import ComparisonMode from '../components/ComparisonMode';
import VoiceSearchButton from '../components/VoiceSearchButton';
import { useGeolocation } from '../hooks/useGeolocation';

const HomePage = () => {
  // ===== 1. State Management =====
  // Location can be string (city name) OR object {lat, lon}
  const [location, setLocation] = useState('Nairobi'); 
  const [locationType, setLocationType] = useState('city'); // 'city' or 'coords'
  const [unit, setUnit] = useState('metric');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSunAlert, setShowSunAlert] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [userCity, setUserCity] = useState('');
  
  // Forecast specific state
  const [forecastData, setForecastData] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState(null);

  // ===== 2. Custom Hooks =====
  // Use the updated weather hook that accepts location (city string OR coordinates object)
  const { data: weatherData, isLoading, error, refetch } = useWeather(location, unit);
  const { isDark, toggleTheme } = useThemeContext();
  
  // Geolocation hook
  const { 
    location: geoLocation, 
    error: geoError, 
    loading: geoLoading, 
    cityName: detectedCity,
    getCurrentLocation 
  } = useGeolocation();

  // ===== 3. Effects for Geolocation =====
  // Update location status based on geolocation hook state
  useEffect(() => {
    if (geoLoading) {
      setLocationStatus('loading');
    } else if (detectedCity) {
      setLocationStatus('success');
      setUserCity(detectedCity);
      
      // If we have coordinates, use them for more accurate weather
      if (geoLocation) {
        setLocation({ lat: geoLocation.latitude, lon: geoLocation.longitude });
        setLocationType('coords');
      } else {
        setLocation(detectedCity);
        setLocationType('city');
      }
    } else if (geoError) {
      setLocationStatus('error');
      console.log('Geolocation error:', geoError);
    }
  }, [geoLoading, detectedCity, geoError, geoLocation]);

  // Get location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // ===== 4. Fetch forecast data =====
  const fetchForecastData = useCallback(async (loc, currentUnit) => {
    if (!loc) return;
    
    setForecastLoading(true);
    setForecastError(null);
    
    try {
      const { data, error } = await fetchForecast(loc, currentUnit);
      
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

  // Fetch forecast when location/unit changes
  useEffect(() => {
    if (location) {
      fetchForecastData(location, unit);
    }
  }, [location, unit, fetchForecastData]);

  // ===== 5. Load recent searches from localStorage =====
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  // ===== 6. Sunlight Detection Logic =====
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

  // ===== 7. Event Handlers =====
  const handleSearch = (newCity) => {
    // Clean the city name
    const cleanedCity = newCity
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing spaces
    
    console.log('Searching for city:', cleanedCity);
    
    // Switch to city mode
    setLocation(cleanedCity);
    setLocationType('city');
    setLocationStatus('idle');
    
    // Update Recent Searches
    const updated = [cleanedCity, ...recentSearches.filter(c => c !== cleanedCity)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleUnitToggle = () => {
    setUnit(prev => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const handleRefresh = () => {
    refetch(); // Refetches current weather
    fetchForecastData(location, unit); // Refetches forecast
  };

  // ===== 8. Location Status Indicator Component =====
  const LocationIndicator = () => {
    if (locationStatus === 'loading') {
      return (
        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 animate-pulse">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Detecting your location...</span>
        </div>
      );
    }
    
    if (locationStatus === 'success' && userCity) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 animate-fade-in">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>📍 Showing weather for your area: {userCity}</span>
        </div>
      );
    }
    
    if (locationStatus === 'error') {
      return (
        <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Using default location. Click the location button to detect your area.</span>
          <button 
            onClick={getCurrentLocation}
            className="text-xs underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 transition-colors duration-500">
      {/* Notification Center */}
      <NotificationCenter 
        weatherData={weatherData} 
        forecastData={forecastData} 
      />
      
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

      {/* Location Status Indicator */}
      <div className="mb-4">
        <LocationIndicator />
      </div>

      {/* Search Section with Voice Search */}
      <section className="mb-8 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} isLoading={isLoading || forecastLoading} />
          </div>
          <VoiceSearchButton onSearch={handleSearch} />
          {/* Manual location button */}
          <button
            onClick={getCurrentLocation}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors button-press"
            title="Detect my location"
            disabled={locationStatus === 'loading'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <RecentSearches searches={recentSearches} onSelectCity={handleSearch} />
      </section>

      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black tracking-tight dark:text-white">
          Weather Dashboard
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
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
            <WeatherCard 
              weatherData={weatherData} 
              unit={unit}
              onRefresh={handleRefresh}
              lastUpdated={new Date().toLocaleTimeString()}
            />
            
            {/* Outfit Advisor */}
            <OutfitAdvisor weatherData={weatherData} />
            
            {/* Comparison Mode */}
            <ComparisonMode />
            
            {/* 5-Day Forecast */}
            <section className="mt-6">
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