import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';

const ProductGrid = () => {
  const { products, categories, addToCart, cart } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode?.includes(searchTerm)
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]); // Re-run when products change

  const handleProductClick = (product) => {
    if (product.stock === 0) {
      alert('This product is out of stock');
      return;
    }
    
    // Check if adding would exceed stock
    const cartItem = cart.find(item => item.id === product.id);
    const currentCartQty = cartItem ? cartItem.quantity : 0;
    
    if (currentCartQty >= product.stock) {
      alert(`Cannot add more. Only ${product.stock} items available.`);
      return;
    }
    
    addToCart(product);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search products by name or barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Toutes les Produits
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg">No products found</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                disabled={product.stock === 0}
                className={`bg-white rounded-lg p-4 shadow hover:shadow-lg transition-all text-left ${
                  product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">📦</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 truncate" title={product.name}>
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className={`text-xs font-semibold px-2 py-1 rounded ${
                    product.stock === 0 ? 'bg-red-100 text-red-600' :
                    product.stock < 10 ? 'bg-yellow-100 text-yellow-600' : 
                    'bg-green-100 text-green-600'
                  }`}>
                    Stock: {product.stock}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;