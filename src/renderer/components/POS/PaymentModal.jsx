import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Receipt from './Receipt';

const PaymentModal = ({ onClose }) => {
  const {
    cart,
    clearCart,
    currentUser,
    getCartSubtotal,
    getCartTax,
    completeTransaction, // This is now being used
    loadProducts // Add this to reload products after transaction
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState(null);

  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const total = subtotal + tax;
  const change = amountReceived ? parseFloat(amountReceived) - total : 0;

  const handlePayment = async () => {
    if (paymentMethod === 'cash' && parseFloat(amountReceived) < total) {
      alert('Amount received is less than total');
      return;
    }
  
    setProcessing(true);
  
    const transaction = {
      total: total,
      subtotal: subtotal,
      tax: tax,
      discount: 0,
      payment_method: paymentMethod,
      user_id: currentUser.id
    };
  
    const items = cart.map(item => ({
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price
    }));
  
    const result = await completeTransaction(transaction, items);
  
    if (result.success) {
      setTransactionId(result.data.id);
      setCompleted(true);
      // No need to call loadProducts here since completeTransaction already does it
    } else {
      alert('Error processing payment: ' + result.error);
    }
  
    setProcessing(false);
  };

  const handleComplete = () => {
    clearCart();
    onClose();
  }

  if (completed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
            <p className="text-gray-600 mt-2">Transaction #{transactionId}</p>
          </div>

          <Receipt
            transaction={{
              id: transactionId,
              subtotal,
              tax,
              total,
              payment_method: paymentMethod,
              created_at: new Date().toISOString()
            }}
            items={cart}
            amountReceived={paymentMethod === 'cash' ? parseFloat(amountReceived) : total}
            change={paymentMethod === 'cash' ? change : 0}
          />

          <button
            onClick={handleComplete}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-4"
          >
            Complete & New Sale
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>total HT:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-800 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`py-3 rounded-lg font-medium transition-colors ${paymentMethod === 'cash'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              💵 Cash
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`py-3 rounded-lg font-medium transition-colors ${paymentMethod === 'card'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              💳 Card
            </button>
            <button
              onClick={() => setPaymentMethod('mobile')}
              className={`py-3 rounded-lg font-medium transition-colors ${paymentMethod === 'mobile'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              📱 Mobile
            </button>
          </div>
        </div>

        {/* Cash Amount Input */}
        {paymentMethod === 'cash' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount Received
            </label>
            <input
              type="number"
              step="0.01"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="0.00"
            />
            {amountReceived && change >= 0 && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Change:</p>
                <p className="text-2xl font-bold text-green-600">
                  ${change.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={processing || (paymentMethod === 'cash' && !amountReceived)}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {processing ? 'Processing...' : 'Complete Payment'}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;