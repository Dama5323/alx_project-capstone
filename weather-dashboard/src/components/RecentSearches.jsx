import React from 'react';

const RecentSearches = ({ searches, onSelectCity }) => {
  if (!searches || searches.length === 0) return null;

  return (
    /* Changed max-w-md to max-w-2xl to align with our new SearchBar */
    <div className="w-full max-w-2xl mx-auto mt-4 px-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
          Recent Searches
        </h3>
        {/* Optional: You could add a 'Clear' button here later */}
      </div>

      {/* Mobile: Horizontal scroll (no-scrollbar logic)
          Desktop: Wrap naturally 
      */}
      <div className="flex overflow-x-auto pb-2 sm:flex-wrap gap-2 scrollbar-hide">
        {searches.map((city, index) => (
          <button
            key={`${city}-${index}`}
            onClick={() => onSelectCity(city)}
            className="
              whitespace-nowrap px-4 py-1.5 
              bg-white/50 dark:bg-gray-800/50 
              hover:bg-blue-50 dark:hover:bg-gray-700 
              text-gray-700 dark:text-gray-300 
              border border-gray-200 dark:border-gray-700
              hover:border-blue-300 dark:hover:border-blue-500
              rounded-full text-sm font-medium 
              transition-all duration-200 active:scale-95
            "
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;