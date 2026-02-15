import React from 'react';

const RecentSearches = ({ searches, onSelectCity }) => {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h3 className="text-gray-600 text-sm font-semibold mb-2">Recent Searches</h3>
      <div className="flex flex-wrap gap-2">
        {searches.map((city, index) => (
          <button
            key={index}
            onClick={() => onSelectCity(city)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;