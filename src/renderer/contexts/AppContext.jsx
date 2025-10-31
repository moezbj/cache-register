import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const result = await window.api.products.getAll();
    if (result.success) {
      setProducts(result.data);
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    const result = await window.api.categories.getAll();
    if (result.success) {
      setCategories(result.data);
    }
  };

  const login = async (username, password) => {
    const result = await window.api.users.login(username, password);
    if (result.success) {
      setCurrentUser(result.data);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };
  
  const completeTransaction = async (transaction, items) => {
    const result = await window.api.transactions.create(transaction, items);    
    if (result.success) {
      await loadProducts(); // Make sure we await this
      return result;
    }
    return result;
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartSubtotal = () => {
    return getCartTotal();
  };

  const getCartTax = (taxRate = 0.10) => {
    return getCartSubtotal() * taxRate;
  };

  const value = {
    currentUser,
    cart,
    products,
    categories,
    loading,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    completeTransaction,
    getCartSubtotal,
    getCartTax,
    loadProducts,
    loadCategories
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};