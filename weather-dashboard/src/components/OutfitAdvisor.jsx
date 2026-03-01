// components/OutfitAdvisor.jsx
import React, { useState } from 'react';
import { getOutfitSuggestion } from '../utils/outfitAdvisor';

const OutfitAdvisor = ({ weatherData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!weatherData) return null;

  const suggestion = getOutfitSuggestion(weatherData);

  return (
    <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">👔</span>
          <h3 className="text-lg font-bold dark:text-white">Outfit Advisor</h3>
        </div>
        <span className="text-2xl">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fade-in">
          <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-xl">
            <p className="text-gray-800 dark:text-white font-medium mb-2">
              👕 {suggestion.outfit}
            </p>
            
            {suggestion.accessories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {suggestion.accessories.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
            
            {suggestion.advice && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 italic">
                💡 {suggestion.advice}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitAdvisor;