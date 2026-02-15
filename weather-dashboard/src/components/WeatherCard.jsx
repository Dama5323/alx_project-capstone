import React from 'react';

const WeatherCard = ({ weatherData, unit, onRefresh }) => {
  if (!weatherData) return null;

  const {
    name,
    main: { temp, humidity, feels_like, temp_min, temp_max },
    weather,
    wind: { speed },
    sys: { country, sunrise, sunset }
  } = weatherData;

  const weatherCondition = weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${weatherCondition.icon}@4x.png`;

  // Format time from timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get background gradient based on weather condition
  const getWeatherGradient = () => {
    const condition = weatherCondition.main.toLowerCase();
    if (condition.includes('clear')) return 'from-yellow-400 to-orange-500';
    if (condition.includes('cloud')) return 'from-gray-300 to-gray-500';
    if (condition.includes('rain')) return 'from-blue-400 to-blue-600';
    if (condition.includes('snow')) return 'from-blue-100 to-blue-300';
    if (condition.includes('thunder')) return 'from-purple-500 to-purple-700';
    return 'from-blue-400 to-blue-600';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Weather Card */}
      <div className={`bg-gradient-to-br ${getWeatherGradient()} rounded-2xl shadow-xl overflow-hidden`}>
        {/* City Header with Refresh Button */}
        <div className="p-6 bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                {name}, {country}
              </h2>
              <p className="text-white/80 text-lg mt-1 capitalize">
                {weatherCondition.description}
              </p>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Refresh weather data"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Weather Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Temperature and Icon */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center justify-center md:justify-start w-full">
                <img 
                  src={iconUrl} 
                  alt={weatherCondition.description}
                  className="w-24 h-24 md:w-32 md:h-32"
                />
                <div className="ml-4">
                  <div className="text-6xl md:text-7xl font-bold text-white">
                    {Math.round(temp)}°{unit === 'metric' ? 'C' : 'F'}
                  </div>
                  <p className="text-white/80 text-lg">
                    Feels like {Math.round(feels_like)}°
                  </p>
                </div>
              </div>
              
              {/* Min/Max Temperature */}
              <div className="flex gap-4 mt-4 text-white/90">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <span>H: {Math.round(temp_max)}°</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>L: {Math.round(temp_min)}°</span>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="grid grid-cols-2 gap-4">
              {/* Humidity */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center text-white/80 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                  <span className="text-sm">Humidity</span>
                </div>
                <p className="text-2xl font-semibold text-white">{humidity}%</p>
              </div>

              {/* Wind Speed */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center text-white/80 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="text-sm">Wind</span>
                </div>
                <p className="text-2xl font-semibold text-white">
                  {speed} {unit === 'metric' ? 'm/s' : 'mph'}
                </p>
              </div>

              {/* Sunrise */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center text-white/80 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                  <span className="text-sm">Sunrise</span>
                </div>
                <p className="text-xl font-semibold text-white">{formatTime(sunrise)}</p>
              </div>

              {/* Sunset */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center text-white/80 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span className="text-sm">Sunset</span>
                </div>
                <p className="text-xl font-semibold text-white">{formatTime(sunset)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated Info */}
      <p className="text-center text-gray-500 text-sm mt-4">
        Last updated: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
};

export default WeatherCard;