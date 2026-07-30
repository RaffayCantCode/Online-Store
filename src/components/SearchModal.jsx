import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, Tag, Star, TrendingUp, Clock } from 'lucide-react';

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
    setSelectedCategory,
    setShopFilter
  } = useStore();

  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setCategoryFilter('all');
    }
  }, [isSearchModalOpen]);

  const validProducts = useMemo(() => products.filter(p => p && p.id), [products]);

  const popularSearches = useMemo(() => {
    const entries = Object.entries(productViewCounts || {}).filter(([, count]) => count > 0);
    entries.sort((a, b) => b[1] - a[1]);
    const topIds = entries.slice(0, 5).map(([id]) => id);
    return topIds.map(id => {
      const p = validProducts.find(pr => pr.id === id);
      return p ? p.name : null;
    }).filter(Boolean);
  }, [productViewCounts, validProducts]);

  const topViewed = useMemo(() => {
    const viewed = validProducts
      .filter(p => (productViewCounts[p.id] || 0) > 0)
      .sort((a, b) => (productViewCounts[b.id] || 0) - (productViewCounts[a.id] || 0))
      .slice(0, 4);
    return viewed.length > 0 ? viewed : validProducts.slice(0, 4);
  }, [validProducts, productViewCounts]);

  if (!isSearchModalOpen) return null;

  const displayPopular = popularSearches.length > 0
    ? popularSearches
    : ["Hydrating Serum", "Liquid Lipstick", "Chronograph Watch", "Oversized Hoodie", "Sunscreen SPF 50"];

  const matchingProducts = query.trim()
    ? validProducts.filter(p => {
        const q = query.toLowerCase();
        const name = (p.name || '');
        const brand = (p.brand || '');
        const desc = (p.description || '');
        const cat = (p.categoryId || p.category || '');
        const subcat = (p.subcategoryId || p.subcategory || '');
        const matchesQuery =
          name.toLowerCase().includes(q) ||
          brand.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q) ||
          cat.toLowerCase().includes(q) ||
          subcat.toLowerCase().includes(q);
        const matchesCategory = categoryFilter === 'all' || cat === categoryFilter;
        return matchesQuery && matchesCategory;
      })
    : [];

  const matchingCategories = query.trim()
    ? categories.filter(c => {
        const q = query.toLowerCase();
        return (c.name || '').toLowerCase().includes(q) ||
          (c.subcategories || []).some(s => (s.name || '').toLowerCase().includes(q));
      })
    : [];

  const handleProductClick = (product) => {
    trackProductView(product.id);
    setSelectedProductModal(product);
    setIsSearchModalOpen(false);
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setShopFilter('all');
    setCurrentView('shop');
    setIsSearchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        onClick={() => setIsSearchModalOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="relative min-h-screen sm:min-h-0 sm:p-6 md:p-16 flex items-start sm:items-center justify-center">
        <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-3xl shadow-2xl border border-gray-200 z-50 sm:my-8 flex flex-col sm:max-h-[85vh] overflow-hidden animate-fade-in">
          {/* Search Input Header */}
          <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
            <div className="flex items-center gap-3 px-4 sm:px-6 py-4">
              <Search className="w-5 h-5 text-brand-orange shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="flex-1 text-base outline-none text-gray-900 placeholder:text-gray-400 bg-transparent font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg shrink-0 transition"
              >
                ESC
              </button>
            </div>

            {query.trim() && (
              <div className="px-4 sm:px-6 pb-3 flex items-center gap-2 overflow-x-auto">
                <Tag className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                      categoryFilter === 'all'
                        ? 'bg-brand-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                        categoryFilter === cat.id
                          ? 'bg-brand-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="overflow-y-auto flex-1">
            {!query.trim() ? (
              <div className="p-4 sm:p-6 space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-brand-orange" />
                    <p className="text-xs font-black text-gray-800 uppercase tracking-wider">Popular Searches</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {displayPopular.map(term => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="text-xs bg-gray-100 hover:bg-orange-50 hover:text-brand-orange text-gray-700 font-bold px-4 py-2 rounded-xl transition border border-gray-200 hover:border-orange-300"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-4 h-4 text-brand-orange" />
                    <p className="text-xs font-black text-gray-800 uppercase tracking-wider">Trending Products</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {topViewed.map(product => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="flex items-center space-x-3 p-2.5 bg-gray-50 hover:bg-orange-50 rounded-xl cursor-pointer border border-gray-200 hover:border-orange-200 transition group"
                      >
                        <img
                          src={(product.images || [])[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-brand-orange transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-[11px] font-bold text-brand-orange">
                            Rs. {(product.price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-black text-gray-800 uppercase tracking-wider mb-3">Browse Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className="bg-brand-black hover:bg-brand-orange text-white text-xs font-bold px-4 py-2 rounded-xl transition border border-brand-black"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6">
                {matchingCategories.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-black text-gray-800 uppercase tracking-wider mb-2">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {matchingCategories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.id)}
                          className="flex items-center space-x-1.5 bg-brand-black text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-brand-orange transition"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-black text-gray-800 uppercase tracking-wider">
                      Products ({matchingProducts.length})
                    </p>
                    {categoryFilter !== 'all' && (
                      <button
                        onClick={() => setCategoryFilter('all')}
                        className="text-[11px] font-bold text-brand-orange hover:underline"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>

                  {matchingProducts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
                      <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-gray-700">No products found for "{query}"</p>
                      <p className="text-xs text-gray-500 mt-1">Try "serum", "watch", "hoodie" or "lipstick"</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {matchingProducts.map(product => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-xl cursor-pointer border border-transparent hover:border-orange-200 transition group"
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <img
                              src={(product.images || [])[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-xl border border-gray-200 group-hover:scale-105 transition-transform shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-brand-orange transition-colors">
                                {product.name}
                              </h4>
                              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                                {product.brand && (
                                  <span className="font-bold text-gray-700">{product.brand}</span>
                                )}
                                {product.brand && <span>•</span>}
                                <span className="capitalize">{product.categoryId || product.category || 'General'}</span>
                              </div>
                              {product.rating > 0 && (
                                <div className="flex items-center space-x-1 mt-0.5">
                                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                  <span className="text-[11px] font-bold text-gray-500">{product.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0 ml-3">
                            <div className="text-sm font-black text-gray-900">
                              Rs. {(product.price || 0).toLocaleString()}
                            </div>
                            {product.originalPrice > product.price && (
                              <div className="text-[10px] text-gray-400 line-through font-bold">
                                Rs. {(product.originalPrice || 0).toLocaleString()}
                              </div>
                            )}
                            {product.discountPercentage > 0 && (
                              <div className="text-[10px] font-black text-green-700">
                                -{product.discountPercentage}%
                              </div>
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
    </div>
  );
};
