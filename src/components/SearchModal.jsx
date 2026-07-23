import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ShoppingBag, ArrowRight, Tag, ChevronDown } from 'lucide-react';

export const SearchModal = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    products, 
    categories,
    productViewCounts,
    trackProductView,
    setSelectedProductModal,
    setCurrentView,
    setSelectedCategory
  } = useStore();

  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setCategoryFilter('all');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  // Dynamic popular searches: top 5 most-viewed product names
  const popularSearches = useMemo(() => {
    const entries = Object.entries(productViewCounts).filter(([, count]) => count > 0);
    entries.sort((a, b) => b[1] - a[1]);
    const topIds = entries.slice(0, 5).map(([id]) => id);
    return topIds.map(id => {
      const p = products.find(pr => pr.id === id);
      return p ? p.name : null;
    }).filter(Boolean);
  }, [productViewCounts, products]);

  // Fallback popular searches if no views yet
  const displayPopular = popularSearches.length > 0
    ? popularSearches
    : ["Hydrating Serum", "Liquid Lipstick", "Chronograph Watch", "Oversized Hoodie", "Sunscreen SPF 50"];

  // Filter matching products (with category filter)
  const matchingProducts = query.trim()
    ? products.filter(p => {
        const matchesQuery = 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          (p.description || '').toLowerCase().includes(query.toLowerCase()) ||
          p.categoryId.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
        return matchesQuery && matchesCategory;
      })
    : [];

  // Filter matching categories (always show matching categories regardless of category filter)
  const matchingCategories = query.trim() ? categories.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.subcategories?.some(s => s.name.toLowerCase().includes(query.toLowerCase()))
  ) : [];

  const handleProductClick = (product) => {
    trackProductView(product.id);
    setSelectedProductModal(product);
    setIsSearchModalOpen(false);
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setCurrentView('shop');
    setIsSearchModalOpen(false);
  };

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
          <Search className="w-5 h-5 text-brand-orange shrink-0" />
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
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Dropdown */}
        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-bold bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-brand-orange text-gray-700"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {!query.trim() ? (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {displayPopular.map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      // Also set category filter to match the product's category if possible
                      const product = products.find(p => p.name === term);
                      if (product) setCategoryFilter(product.categoryId);
                    }}
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
                        onClick={() => handleCategoryClick(cat.id)}
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
                  {categoryFilter !== 'all' && <span className="text-brand-orange ml-1">in {categories.find(c => c.id === categoryFilter)?.name || categoryFilter}</span>}
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
                        onClick={() => handleProductClick(product)}
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
                            Rs. {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="block text-[10px] text-gray-400 line-through">
                              Rs. {product.originalPrice.toLocaleString()}
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
