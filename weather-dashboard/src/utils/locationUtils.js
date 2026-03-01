// src/utils/locationUtils.js
export const getDisplayLocation = (weatherData, userCity, locationType) => {
  if (!weatherData) return 'Loading...';
  
  // If we have weather data, use the name from API (it knows the actual town name)
  if (weatherData.name) {
    return weatherData.name;
  }
  
  // Fallback to detected city or default
  return userCity || 'Your Location';
};