import React, { useState, useEffect } from 'react';

const useWeatherNotifications = (weatherData, forecastData) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!weatherData || !forecastData || !forecastData.list) return;

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
        message: `🌡️ Temperature will change by ${Math.round(bigShift.change)}°C in the next few hours`,
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

const NotificationCenter = ({ weatherData, forecastData }) => {
  const notifications = useWeatherNotifications(weatherData, forecastData);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (notifications.length > 0) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!visible || notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`
            animate-slide-in-right p-4 rounded-xl shadow-lg backdrop-blur-md
            ${notif.type === 'danger' ? 'bg-red-500/90 text-white' : 
              notif.type === 'warning' ? 'bg-yellow-500/90 text-gray-900' :
              'bg-blue-500/90 text-white'}
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{notif.icon}</span>
            <p className="font-medium">{notif.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;