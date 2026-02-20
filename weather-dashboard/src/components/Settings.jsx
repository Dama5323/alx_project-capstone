import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    temperatureUnit: 'celsius',
    windSpeedUnit: 'kmh',
    darkMode: false,
    autoRefresh: true,
    refreshInterval: 5,
    language: 'en'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('weatherSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    setSettings({
      temperatureUnit: 'celsius',
      windSpeedUnit: 'kmh',
      darkMode: false,
      autoRefresh: true,
      refreshInterval: 5,
      language: 'en'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Temperature Unit */}
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Temperature Unit</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="temperatureUnit"
                value="celsius"
                checked={settings.temperatureUnit === 'celsius'}
                onChange={handleChange}
                className="text-blue-500"
              />
              <span className="text-gray-700">Celsius (°C)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="temperatureUnit"
                value="fahrenheit"
                checked={settings.temperatureUnit === 'fahrenheit'}
                onChange={handleChange}
                className="text-blue-500"
              />
              <span className="text-gray-700">Fahrenheit (°F)</span>
            </label>
          </div>
        </div>

        {/* Wind Speed Unit */}
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Wind Speed Unit</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="windSpeedUnit"
                value="kmh"
                checked={settings.windSpeedUnit === 'kmh'}
                onChange={handleChange}
                className="text-blue-500"
              />
              <span className="text-gray-700">Kilometers per hour (km/h)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="windSpeedUnit"
                value="mph"
                checked={settings.windSpeedUnit === 'mph'}
                onChange={handleChange}
                className="text-blue-500"
              />
              <span className="text-gray-700">Miles per hour (mph)</span>
            </label>
          </div>
        </div>

        {/* Auto Refresh */}
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Auto Refresh</h2>
          <div className="flex items-center justify-between">
            <label className="text-gray-700">Enable auto-refresh</label>
            <button
              onClick={() => setSettings(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoRefresh ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {settings.autoRefresh && (
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Refresh interval (minutes)</label>
              <select
                name="refreshInterval"
                value={settings.refreshInterval}
                onChange={handleChange}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
          )}
        </div>

        {/* Language */}
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Language</h2>
          <select
            name="language"
            value={settings.language}
            onChange={handleChange}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="zh">中文</option>
          </select>
        </div>

        {/* About Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
          <p className="text-gray-600 mb-2">
            Weather Dashboard v1.0.0
          </p>
          <p className="text-gray-500 text-sm">
            Data provided by OpenWeatherMap. This app demonstrates advanced React concepts including Formik, TanStack Query, and protected routes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t">
          <button
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;