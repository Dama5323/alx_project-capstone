import React, { useState } from 'react';
import SearchBar from './SearchBar';

const useCityComparison = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const addCity = async (cityName) => {
    if (cities.length >= 4) {
      alert('Maximum 4 cities allowed for comparison');
      return;
    }

    setLoading(true);
    try {
      // This would need your weather service
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      setCities(prev => [...prev, { ...data, id: Date.now() }]);
    } catch (error) {
      console.error('Failed to add city:', error);
    }
    setLoading(false);
  };

  const removeCity = (id) => {
    setCities(prev => prev.filter(city => city.id !== id));
  };

  const clearAll = () => setCities([]);

  return { cities, addCity, removeCity, clearAll, loading };
};

const ComparisonMode = () => {
  const { cities, addCity, removeCity, clearAll, loading } = useCityComparison();
  const [isActive, setIsActive] = useState(false);

  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
      >
        🔍 Compare Cities
      </button>
    );
  }

  return (
    <div className="mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold dark:text-white">Compare Cities</h3>
        <button
          onClick={() => setIsActive(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {cities.length < 4 && (
        <div className="mb-4">
          <SearchBar 
            onSearch={addCity} 
            placeholder="Add city to compare..."
            isLoading={loading}
          />
        </div>
      )}

      {cities.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cities.map(city => (
              <div
                key={city.id}
                className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 shadow-md"
              >
                <button
                  onClick={() => removeCity(city.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
                
                <h4 className="font-bold text-lg dark:text-white">{city.name}</h4>
                <div className="mt-2 space-y-1">
                  <p className="text-3xl font-black">{Math.round(city.main.temp)}°</p>
                  <p className="text-sm capitalize">{city.weather[0].description}</p>
                  <div className="text-xs space-y-1 mt-2">
                    <p>💧 Humidity: {city.main.humidity}%</p>
                    <p>🌪️ Wind: {city.wind.speed} m/s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {cities.length > 1 && (
            <button
              onClick={clearAll}
              className="mt-4 text-sm text-red-500 hover:text-red-600"
            >
              Clear all
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ComparisonMode;