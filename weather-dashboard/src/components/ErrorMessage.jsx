// src/components/ErrorMessage.jsx
import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  // Safely convert message to string
  const displayMessage = typeof message === 'object' 
    ? message?.message || 'An unexpected error occurred' 
    : message || 'An unexpected error occurred';

  return (
    <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl text-center animate-shake">
      <div className="flex flex-col items-center gap-3">
        {/* Error Icon */}
        <svg 
          className="w-12 h-12 text-red-500 dark:text-red-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        
        <p className="text-red-600 dark:text-red-400 font-semibold">
          {displayMessage}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors button-press"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;