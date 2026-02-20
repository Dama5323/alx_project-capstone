import React, { useState } from 'react';

const SearchBar = ({ onSearch, isLoading }) => {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }
    setError('');
    onSearch(city.trim());
    setCity(''); // Clear input after search
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            {/* Search Icon */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (error) setError(''); // Clear error while typing
              }}
              placeholder="Search for a city (e.g. Nairobi, London)..."
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 
                bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white
                ${error 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/50'
                }`}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="sm:w-32 px-6 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-md hover:shadow-lg flex items-center justify-center"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Error Message - Absolute position so it doesn't "jump" the layout */}
        {error && (
          <p className="absolute -bottom-6 left-0 text-red-500 text-xs font-medium animate-pulse">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default SearchBar;