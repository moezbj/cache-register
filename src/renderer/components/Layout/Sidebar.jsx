import React from 'react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'pos', label: 'Point de vente', icon: '🛒' },
    { id: 'inventory', label: 'Stocks', icon: '📦' },
    { id: 'transactions', label: 'Transactions', icon: '📋' },
    { id: 'reports', label: 'Rapports', icon: '📊' }
  ];

  return (
    <div className="bg-gray-900 text-white w-64 flex-shrink-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Cash Register</h2>
        <p className="text-gray-400 text-sm mt-1">POS System</p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center px-6 py-4 text-left transition-colors ${
              currentView === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="text-2xl mr-3">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-800">
        <div className="text-sm text-gray-400">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2025 Cash Register</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;