import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteCities');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    setLoading(false);
  }, []);

  const removeFavorite = (cityToRemove) => {
    const updated = favorites.filter(city => city !== cityToRemove);
    setFavorites(updated);
    localStorage.setItem('favoriteCities', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Favorite Cities</h1>
      
      {favorites.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <svg 
            className="mx-auto h-16 w-16 text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
          <p className="text-gray-500 text-lg mb-4">You haven't added any favorite cities yet</p>
          <Link 
            to="/" 
            className="inline-block px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Browse Weather
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((city) => (
            <div key={city} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{city}</h3>
                  <button
                    onClick={() => removeFavorite(city)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove from favorites"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    to={`/weather/${city}`}
                    className="flex-1 text-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/?city=${city}`}
                    className="flex-1 text-center px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                  >
                    Quick View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;