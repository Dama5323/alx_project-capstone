import React from 'react';

// Helper function to get most frequent item in array
const getMostFrequent = (arr) => {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length - arr.filter(v => v === b).length
  ).pop();
};

// Process forecast data
const processForecastData = (forecastList) => {
  const dailyData = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        temps: [],
        minTemps: [],
        maxTemps: [],
        pop: [],
        icons: [],
        descriptions: []
      };
    }
    
    dailyData[date].temps.push(item.main.temp);
    dailyData[date].minTemps.push(item.main.temp_min);
    dailyData[date].maxTemps.push(item.main.temp_max);
    dailyData[date].pop.push(item.pop || 0);
    dailyData[date].icons.push(item.weather[0].icon);
    dailyData[date].descriptions.push(item.weather[0].description);
  });

  return Object.values(dailyData).map(day => ({
    ...day,
    avgTemp: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
    minTemp: Math.round(Math.min(...day.minTemps)),
    maxTemp: Math.round(Math.max(...day.maxTemps)),
    maxPop: Math.round(Math.max(...day.pop) * 100),
    icon: getMostFrequent(day.icons),
    description: getMostFrequent(day.descriptions),
  })).slice(0, 5);
};

const ForecastChart = ({ forecastData, unit }) => {
  if (!forecastData || !forecastData.list) {
    return null;
  }

  // Process the 40 readings into 5 clean days
  const dailyForecasts = processForecastData(forecastData.list);

  return (
    <div className="mt-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <h3 className="text-xl font-bold mb-6 dark:text-white text-gray-800 px-2">
        5-Day Forecast
      </h3>
      
      {/* Responsive Layout: Scroll on mobile, Grid on desktop */}
      <div className="flex overflow-x-auto gap-4 pb-4 sm:grid sm:grid-cols-5 scrollbar-hide">
        {dailyForecasts.map((day, index) => (
          <div 
            key={index} 
            className="min-w-[160px] bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-300 dark:border-gray-700 flex flex-col items-center shadow-md hover:shadow-lg transition-all duration-300"
          >
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              {day.date.split(',')[0]}
            </span>
            
            <div className="bg-gray-200/50 dark:bg-gray-700/50 rounded-full p-2 mb-2">
              <img 
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                alt={day.description}
                className="w-14 h-14"
              />
            </div>
            
            <span className="text-2xl font-black text-gray-800 dark:text-white mb-2">
              {day.avgTemp}°{unit === 'metric' ? 'C' : 'F'}
            </span>
            
            <span className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold mb-3 bg-gray-200/70 dark:bg-gray-700/70 px-3 py-1 rounded-full">
              {day.description}
            </span>

            {/* Rain Probability */}
            {day.maxPop > 0 && (
              <div className="w-full mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Rain</span>
                  <span className="text-gray-800 dark:text-gray-200 font-bold">{day.maxPop}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-500 dark:bg-gray-500 rounded-full"
                    style={{ width: `${day.maxPop}%` }}
                  />
                </div>
              </div>
            )}

            {/* Temperature Range */}
            <div className="flex justify-between w-full text-sm font-bold pt-3 border-t border-gray-300 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">H: {day.maxTemp}°</span>
              <span className="text-gray-600 dark:text-gray-400">L: {day.minTemp}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastChart;