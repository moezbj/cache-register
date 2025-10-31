import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './components/Auth/Login';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import POSView from './components/POS/View';
import InventoryView from './components/Inventory/ProductList';
import ReportsView from './components/Reports/Dashboard';
import TransactionsView from './components/Transactions/Transactions';

const AppContent = () => {
  const { currentUser } = useApp();
  const [currentView, setCurrentView] = useState('pos');

  if (!currentUser) {
    return <Login />;
  }
  const renderView = () => {
    switch (currentView) {
      case 'pos':
        return <POSView />;
      case 'inventory':
        return <InventoryView />;
      case 'reports':
        return <ReportsView />;
      case 'transactions':
        return <TransactionsView />;
      default:
        return <POSView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;