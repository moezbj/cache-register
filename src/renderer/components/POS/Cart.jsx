import React from 'react';
import { useApp } from '../../contexts/AppContext';

const Cart = ({ onCheckout }) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    getCartSubtotal,
    getCartTax,
    getCartTotal
  } = useApp();

  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const total = subtotal + tax;

  return (
    <div className="h-full flex flex-col">
      {/* Cart Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800">Produits sélectionées</h2>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Effacer tous
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500">{cart.length} articles</p>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-6xl mb-4">🛒</span>
            <p className="text-lg font-medium">Le panier est vide</p>
            <p className="text-sm">Ajouter des produits</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)} chaque</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQty = parseInt(e.target.value) || 1;
                      if (newQty <= item.stock) {
                        updateCartQuantity(item.id, newQty);
                      } else {
                        alert(`Only ${item.stock} items available in stock`);
                      }
                    }}
                    className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                    min="1"
                    max={item.stock}
                  />
                  <button
                    onClick={() => {
                      if (item.quantity < item.stock) {
                        updateCartQuantity(item.id, item.quantity + 1);
                      } else {
                        alert(`Only ${item.stock} items available in stock`);
                      }
                    }}
                    className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 font-bold"
                  >
                    +
                  </button>
                </div>
                <p className="text-lg font-bold text-blue-600">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              {item.quantity >= item.stock && (
                <p className="text-xs text-red-600 mt-1">Max stock reached</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
          >
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;