import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
      <div className="flex flex-col items-center text-center">
        <svg 
          className="w-16 h-16 text-red-500 dark:text-red-400 mb-4" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-red-600 dark:text-red-300 mb-4">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;