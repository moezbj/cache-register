import React from 'react';

const Receipt = ({ transaction, items, amountReceived, change }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="print-content bg-white p-6 border border-gray-300 rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Cash Register</h1>
          <p className="text-sm text-gray-600">Point of Sale System</p>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(transaction.created_at).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Transaction #{transaction.id}</p>
        </div>

        <div className="border-t border-b border-gray-300 py-4 mb-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between mb-2">
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} x ${item.price.toFixed(2)}
                </p>
              </div>
              <p className="font-semibold">
                ${(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>${transaction.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax:</span>
            <span>${transaction.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-300">
            <span>Total:</span>
            <span>${transaction.total.toFixed(2)}</span>
          </div>
        </div>

        {transaction.payment_method === 'cash' && (
          <div className="space-y-1 mb-4 text-sm">
            <div className="flex justify-between">
              <span>Amount Received:</span>
              <span>${amountReceived.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Change:</span>
              <span>${change.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-600 border-t border-gray-300 pt-4">
          <p className="font-medium mb-1">Payment Method: {transaction.payment_method.toUpperCase()}</p>
          <p>Thank you for your purchase!</p>
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors print:hidden"
      >
        🖨️ Print Receipt
      </button>
    </div>
  );
};

export default Receipt;