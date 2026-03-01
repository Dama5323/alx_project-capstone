// ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    console.log('Error caught in getDerivedStateFromError:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error details:', {
      error,
      errorMessage: error?.message,
      errorStack: error?.stack,
      componentStack: errorInfo?.componentStack
    });
    
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Safely extract error message
      let errorMessage = 'An unexpected error occurred';
      let errorStack = '';
      
      if (this.state.error) {
        if (typeof this.state.error === 'object') {
          errorMessage = this.state.error.message || errorMessage;
          errorStack = this.state.error.stack || '';
        } else if (typeof this.state.error === 'string') {
          errorMessage = this.state.error;
        }
      }
      
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 max-w-lg w-full text-center shadow-xl">
            <div className="text-6xl mb-4 animate-bounce">⚠️</div>
            
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
              Oops! Something went wrong
            </h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 text-left">
              <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                {errorMessage}
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-3">
                  <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700">
                    Technical Details
                  </summary>
                  <pre className="mt-2 text-xs text-gray-500 dark:text-gray-400 overflow-auto max-h-40 p-2 bg-gray-100 dark:bg-gray-900 rounded">
                    {errorStack}
                  </pre>
                  <pre className="mt-2 text-xs text-gray-500 dark:text-gray-400 overflow-auto max-h-40 p-2 bg-gray-100 dark:bg-gray-900 rounded">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors button-press flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors button-press"
              >
                Go Home
              </button>
            </div>
            
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              If this problem persists, please try again later.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;