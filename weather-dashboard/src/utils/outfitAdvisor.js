// src/utils/outfitAdvisor.js
export const getOutfitSuggestion = (weatherData) => {
  const temp = weatherData.main.temp;
  const windSpeed = weatherData.wind.speed;
  const condition = weatherData.weather[0].main;
  const description = weatherData.weather[0].description;
  const humidity = weatherData.main.humidity;

  let suggestion = {
    outfit: '',
    accessories: [],
    advice: ''
  };

  // Temperature-based base outfit
  if (temp < 0) {
    suggestion.outfit = 'Heavy winter coat, thermal layers, gloves, and a warm hat';
    suggestion.accessories.push('scarf', 'winter boots');
  } else if (temp < 10) {
    suggestion.outfit = 'Winter jacket or thick sweater';
    suggestion.accessories.push('scarf', 'light gloves');
  } else if (temp < 15) {
    suggestion.outfit = 'Light jacket or hoodie';
    suggestion.accessories.push('light scarf');
  } else if (temp < 20) {
    suggestion.outfit = 'Long sleeves or light sweater';
  } else if (temp < 25) {
    suggestion.outfit = 'T-shirt and jeans';
  } else {
    suggestion.outfit = 'Shorts, t-shirt, and light fabrics';
    suggestion.accessories.push('sunglasses', 'hat');
  }

  // Wind adjustments
  if (windSpeed > 10) {
    suggestion.advice += ' Windy conditions - bring a windbreaker or secure your layers. ';
  }

  // Rain adjustments
  if (condition.includes('Rain') || description.includes('rain')) {
    suggestion.accessories.push('umbrella', 'waterproof jacket');
    suggestion.advice += ' Rain expected - don\'t forget rain protection. ';
  } else if (condition.includes('Snow')) {
    suggestion.accessories.push('waterproof boots', 'umbrella');
  }

  // Humidity adjustments
  if (humidity > 80 && temp > 20) {
    suggestion.advice += ' High humidity - choose breathable fabrics. ';
  }

  return suggestion;
};