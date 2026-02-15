import React from 'react';

const UnitToggle = ({ unit, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={`text-sm ${unit === 'metric' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
        °C
      </span>
      <button
        onClick={onToggle}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        style={{ backgroundColor: unit === 'metric' ? '#3b82f6' : '#d1d5db' }}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            unit === 'metric' ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm ${unit === 'imperial' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
        °F
      </span>
    </div>
  );
};

export default UnitToggle;