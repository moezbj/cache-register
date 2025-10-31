import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import ProductGrid from './Product';
import Cart from './Cart';
import PaymentModal from './PaymentModal';

const POSView = () => {
  const { cart } = useApp();
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div className="h-full flex">
      {/* Products Section */}
      <div className="flex-1 p-6">
        <ProductGrid />
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white shadow-lg border-l border-gray-200">
        <Cart onCheckout={() => setShowPayment(true)} />
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal onClose={() => setShowPayment(false)} />
      )}
    </div>
  );
};

export default POSView;