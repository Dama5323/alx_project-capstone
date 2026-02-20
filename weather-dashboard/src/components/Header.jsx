import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle'; 

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { theme, isDark } = useThemeContext(); // You don't need toggleTheme here if not used

  console.log('Current theme:', theme, 'isDark:', isDark); // Check console

  const isActive = (path) => {
    return location.pathname === path 
      ? 'text-blue-600 font-semibold bg-blue-50 dark:bg-blue-900 dark:text-blue-200' 
      : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800';
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-3">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2 mb-3 md:mb-0 group">
            <div className="bg-blue-500 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" 
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              Weather<span className="text-blue-500">Dash</span>
            </span>
          </Link>

          {/* Navigation Tabs - SINGLE nav element */}
          <div className="flex items-center space-x-2">
            <nav className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <Link to="/" className={`px-4 py-2 rounded-lg transition-all ${isActive('/')}`}>
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </span>
              </Link>
              <Link to="/favorites" className={`px-4 py-2 rounded-lg transition-all ${isActive('/favorites')}`}>
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Favorites</span>
                </span>
              </Link>
              <Link to="/settings" className={`px-4 py-2 rounded-lg transition-all ${isActive('/settings')}`}>
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </span>
              </Link>
            </nav>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* User Section */}
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <Link to="/profile" className="flex items-center space-x-2">
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="text-sm px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;