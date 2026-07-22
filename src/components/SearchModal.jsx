import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ShoppingBag, ArrowRight, Tag } from 'lucide-react';

export const SearchModal = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    products, 
    categories,
    setSelectedProductModal,
    setCurrentView,
    setSelectedCategory
  } = useStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  // Filter matching products
  const matchingProducts = query.trim() ? products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.brand.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.categoryId.toLowerCase().includes(query.toLowerCase())
  ) : [];

  // Filter matching categories
  const matchingCategories = query.trim() ? categories.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.subcategories?.some(s => s.name.toLowerCase().includes(query.toLowerCase()))
  ) : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div 
        onClick={() => setIsSearchModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-2xl max-w-2xl mx-auto shadow-2xl overflow-hidden border border-gray-100 z-50 animate-fade-in">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-brand-orange" />
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clothing, makeup, skincare, accessories..."
            className="flex-1 text-base outline-none text-gray-900 placeholder:text-gray-400 bg-transparent font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {!query.trim() ? (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["Hydrating Serum", "Liquid Lipstick", "Chronograph Watch", "Oversized Hoodie", "Sunscreen SPF 50"].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    aria-label={`Search for ${term}`}
                    className="text-xs bg-gray-100 hover:bg-orange-50 hover:text-brand-orange text-gray-700 font-medium px-3 py-1.5 rounded-full transition border border-gray-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category Match Suggestions */}
              {matchingCategories.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category Matches</p>
                  <div className="flex flex-wrap gap-2">
                    {matchingCategories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setCurrentView('shop');
                          setIsSearchModalOpen(false);
                        }}
                        className="flex items-center space-x-1.5 text-xs bg-brand-black text-white px-3 py-1.5 rounded-lg hover:bg-brand-orange transition font-semibold"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Match Cards */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Matching Products ({matchingProducts.length})
                </p>

                {matchingProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm font-medium">No products found for "{query}"</p>
                    <p className="text-xs text-gray-400 mt-1">Try searching for "serum", "watch", "hoodie" or "lipstick".</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {matchingProducts.map(product => (
                      <div 
                        key={product.id}
                        onClick={() => {
                          setSelectedProductModal(product);
                          setIsSearchModalOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 hover:bg-orange-50/60 rounded-xl cursor-pointer border border-transparent hover:border-orange-100 transition group"
                      >
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 group-hover:scale-105 transition-transform"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-brand-orange transition-colors">
                              {product.name}
                            </h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span className="font-semibold text-gray-700">{product.brand}</span>
                              <span>•</span>
                              <span className="capitalize">{product.categoryId}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="block text-[10px] text-gray-400 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
