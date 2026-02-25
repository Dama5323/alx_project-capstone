import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Components
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ErrorMessage from './components/ErrorMessage';
import RecentSearches from './components/RecentSearches';
import UnitToggle from './components/UnitToggle';
import WeatherDetails from './components/WeatherDetails';
import Settings from './components/Settings';
import Favorites from './components/Favorites';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header'; 
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ProfilePage from './components/profile/ProfilePage';

// Context
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

//

import HomePage from './pages/HomePage';

// Create QueryClient outside of component to prevent re-creation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  },
});


// Root App with Providers
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider> 
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
              {/* Use the Header component here */}
              <Header />
              
              <main className="container mx-auto px-4 py-4">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/weather/:city" element={<WeatherDetails />} />
                  <Route path="/favorites" element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  } />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
              </main>

              <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-8 py-4 transition-colors">
                <div className="container mx-auto px-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Data provided by OpenWeatherMap • Weather Dashboard © 2026
                  </p>
                </div>
              </footer>
            </div>
          </Router>
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider> {/* This was misplaced */}
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;