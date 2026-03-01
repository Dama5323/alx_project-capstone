import { useEffect, useState } from 'react';

const useWeatherNotifications = (weatherData, forecastData) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!weatherData || !forecastData) return;

    const newNotifications = [];
    
    // Check for precipitation starting soon
    const nextHours = forecastData.list?.slice(0, 3) || [];
    const rainStarting = nextHours.some(hour => 
      hour.pop > 0.3 && hour.weather[0].main.includes('Rain')
    );
    
    if (rainStarting) {
      newNotifications.push({
        id: 'rain-alert',
        type: 'warning',
        message: '🌧️ Rain starting in the next few hours!',
        icon: '☔'
      });
    }
    
    // Check for extreme temperature shifts
    const tempNow = weatherData.main.temp;
    const tempChanges = nextHours.map(hour => ({
      change: Math.abs(hour.main.temp - tempNow),
      hour: new Date(hour.dt * 1000).getHours()
    }));
    
    const bigShift = tempChanges.find(t => t.change > 10);
    if (bigShift) {
      newNotifications.push({
        id: 'temp-shift',
        type: 'info',
        message: `🌡️ Temperature will change by ${bigShift.change}°C in the next few hours`,
        icon: '⚠️'
      });
    }
    
    // Check for severe weather
    const severeConditions = ['Thunderstorm', 'Tornado', 'Squall'];
    const isSevere = severeConditions.includes(weatherData.weather[0].main);
    
    if (isSevere) {
      newNotifications.push({
        id: 'severe-weather',
        type: 'danger',
        message: `⚠️ Severe weather alert: ${weatherData.weather[0].description}`,
        icon: '🚨'
      });
    }
    
    setNotifications(newNotifications);
  }, [weatherData, forecastData]);

  return notifications;
};

export default useWeatherNotifications;