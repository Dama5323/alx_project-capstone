import React from 'react';

const WeatherCard = ({ weatherData, unit, onRefresh, detailed = false, lastUpdated }) => {
  if (!weatherData) return null;

  const {
    name,
    main: { temp, humidity, feels_like, temp_min, temp_max, pressure },
    weather,
    wind: { speed },
    sys: { country, sunrise, sunset },
    visibility,
    clouds,
    coord
  } = weatherData;

  const weatherCondition = weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${weatherCondition.icon}@2x.png`;

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
    if (condition.includes('clear')) return 'from-yellow-400 to-orange-500 dark:from-yellow-600 dark:to-orange-700';
    if (condition.includes('cloud')) return 'from-gray-300 to-gray-500 dark:from-gray-600 dark:to-gray-800';
    if (condition.includes('rain')) return 'from-blue-400 to-blue-600 dark:from-blue-700 dark:to-blue-900';
    if (condition.includes('snow')) return 'from-blue-100 to-blue-300 dark:from-blue-800 dark:to-blue-950';
    if (condition.includes('thunder')) return 'from-purple-500 to-purple-700 dark:from-purple-800 dark:to-purple-950';
    return 'from-blue-400 to-blue-600 dark:from-blue-700 dark:to-blue-900';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Weather Card */}
      <div className={`bg-gradient-to-br ${getWeatherGradient()} rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden transition-colors duration-300`}>
        {/* City Header with Refresh Button */}
        <div className="p-4 md:p-6 bg-black/20 dark:bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-3 sm:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {name}, {country}
              </h2>
              <p className="text-white/80 text-base md:text-lg mt-1 capitalize">
                {weatherCondition.description}
              </p>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 rounded-lg transition-colors"
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
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Temperature and Icon */}
            <div className="flex-1 flex flex-col items-center md:items-start">
              <div className="flex items-center justify-center md:justify-start w-full">
                <img 
                  src={iconUrl} 
                  alt={weatherCondition.description}
                  className="w-16 h-16 md:w-20 md:h-20"
                />
                <div className="ml-3">
                  <div className="text-4xl md:text-5xl font-bold text-white">
                    {Math.round(temp)}°{unit === 'metric' ? 'C' : 'F'}
                  </div>
                  <p className="text-white/80 text-sm md:text-base">
                    Feels like {Math.round(feels_like)}°
                  </p>
                </div>
              </div>
              
              {/* Min/Max Temperature */}
              <div className="flex gap-4 mt-3 text-white/90 text-sm md:text-base">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <span>H: {Math.round(temp_max)}°</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>L: {Math.round(temp_min)}°</span>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              {/* Humidity */}
              <div className="bg-white/20 dark:bg-black/30 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center text-white/80 mb-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                  <span className="text-xs">Humidity</span>
                </div>
                <p className="text-xl font-semibold text-white">{humidity}%</p>
              </div>

              {/* Wind Speed */}
              <div className="bg-white/20 dark:bg-black/30 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center text-white/80 mb-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="text-xs">Wind</span>
                </div>
                <p className="text-xl font-semibold text-white">
                  {speed} {unit === 'metric' ? 'm/s' : 'mph'}
                </p>
              </div>

              {/* Sunrise - only show on detailed view or if space permits */}
              {(detailed || window.innerWidth > 768) && (
                <>
                  <div className="bg-white/20 dark:bg-black/30 backdrop-blur-sm rounded-xl p-3">
                    <div className="flex items-center text-white/80 mb-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                      </svg>
                      <span className="text-xs">Sunrise</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{formatTime(sunrise)}</p>
                  </div>

                  <div className="bg-white/20 dark:bg-black/30 backdrop-blur-sm rounded-xl p-3">
                    <div className="flex items-center text-white/80 mb-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span className="text-xs">Sunset</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{formatTime(sunset)}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated Info */}
      {lastUpdated && (
        <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-2">
          Last updated: {lastUpdated}
        </p>
      )}
    </div>
  );
};

export default WeatherCard;