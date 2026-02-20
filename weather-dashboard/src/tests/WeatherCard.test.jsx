import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherCard from '../components/WeatherCard';

const mockWeatherData = {
  name: 'London',
  sys: { country: 'GB', sunrise: 1618317047, sunset: 1618369047 },
  main: {
    temp: 15.5,
    feels_like: 14.2,
    temp_min: 14.8,
    temp_max: 16.2,
    humidity: 72
  },
  weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
  wind: { speed: 4.1 }
};

describe('WeatherCard', () => {
  test('renders city name and country', () => {
    render(<WeatherCard weatherData={mockWeatherData} unit="metric" />);
    
    expect(screen.getByText('London, GB')).toBeInTheDocument();
  });

  test('displays temperature in Celsius', () => {
    render(<WeatherCard weatherData={mockWeatherData} unit="metric" />);
    
    expect(screen.getByText('16°C')).toBeInTheDocument(); // Rounded from 15.5
  });

  test('displays temperature in Fahrenheit', () => {
    render(<WeatherCard weatherData={mockWeatherData} unit="imperial" />);
    
    // 15.5°C * 9/5 + 32 = 59.9°F ≈ 60°F
    expect(screen.getByText('60°F')).toBeInTheDocument();
  });

  test('displays humidity', () => {
    render(<WeatherCard weatherData={mockWeatherData} unit="metric" />);
    
    expect(screen.getByText('72%')).toBeInTheDocument();
  });

  test('displays wind speed', () => {
    render(<WeatherCard weatherData={mockWeatherData} unit="metric" />);
    
    expect(screen.getByText('4.1 m/s')).toBeInTheDocument();
  });

  test('displays weather condition description', () => {
    render(<WeatherCard weatherData={mockWeatherData} unit="metric" />);
    
    expect(screen.getByText('scattered clouds')).toBeInTheDocument();
  });

  test('calls onRefresh when refresh button clicked', () => {
    const mockRefresh = jest.fn();
    render(
      <WeatherCard 
        weatherData={mockWeatherData} 
        unit="metric" 
        onRefresh={mockRefresh}
      />
    );
    
    const refreshButton = screen.getByTitle('Refresh weather data');
    fireEvent.click(refreshButton);
    
    expect(mockRefresh).toHaveBeenCalled();
  });
});