import React from 'react';
import { useApp } from '../../contexts/AppContext';

const Header = () => {
  const { currentUser, logout } = useApp();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Bienvenue, {currentUser?.full_name || currentUser?.username}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {currentUser?.username}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {currentUser?.role}
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Déconnection
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;