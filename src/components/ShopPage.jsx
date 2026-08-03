import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const ShopPage = () => {
  const { products, categories, selectedCategory, setSelectedCategory, shopFilter, setShopFilter } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState(10000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const uniqueBrands = useMemo(() => {
    const brands = products.map(p => p.brand).filter(Boolean);
    return ['all', ...Array.from(new Set(brands))];
  }, [products]);

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Apply shopFilter theme if set
      if (shopFilter === 'sale' && !product.discountPercentage && !product.isSale) {
        return false;
      }
      if (shopFilter === 'new' && !product.isNewArrival) {
        return false;
      }
      if (shopFilter === 'bestseller' && !product.isBestSeller) {
        return false;
      }
      if (shopFilter === 'trending' && !product.isTrending) {
        return false;
      }

      if (selectedCategory !== 'all' && (product.categoryId || product.category) !== selectedCategory) {
        return false;
      }
      if (selectedSubCategory !== 'all' && (product.subcategoryId || product.subcategory) !== selectedSubCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (product.name || '').toLowerCase().includes(q);
        const matchBrand = (product.brand || '').toLowerCase().includes(q);
        if (!matchName && !matchBrand) return false;
      }
      if (selectedBrand !== 'all' && (product.brand || '') !== selectedBrand) {
        return false;
      }
      if ((product.price || 0) > priceRange) {
        return false;
      }
      if (onlyInStock && (product.inStock === false || (product.stock ?? product.stock_count ?? 0) <= 0)) {
        return false;
      }
      if (onlyDiscounted && (!product.discountPercentage || product.discountPercentage <= 0)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'best-selling') return (b.reviewCount || 0) - (a.reviewCount || 0);
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    });
  }, [products, selectedCategory, shopFilter, selectedSubCategory, searchQuery, selectedBrand, priceRange, onlyInStock, onlyDiscounted, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setSelectedCategory('all');
    setShopFilter('all');
    setSelectedSubCategory('all');
    setSearchQuery('');
    setSelectedBrand('all');
    setPriceRange(10000);
    setOnlyInStock(false);
    setOnlyDiscounted(false);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const getPageTitle = () => {
    if (shopFilter === 'sale') return '🔥 Flash Sale & Special Offers';
    if (shopFilter === 'new') return '✨ New Arrivals Collection';
    if (shopFilter === 'bestseller') return '⭐ Customer Best Sellers';
    if (shopFilter === 'trending') return '🔥 Trending Now Deals';
    if (selectedCategory === 'all') return 'All Products PK';
    if (selectedSubCategory !== 'all') {
      const sub = activeCategoryObj?.subcategories?.find(s => s.id === selectedSubCategory);
      if (sub) return sub.name;
    }
    return activeCategoryObj?.name || selectedCategory;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="bg-brand-black text-white rounded-3xl p-6 sm:p-10 mb-8 border-2 border-brand-orange shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="text-brand-orange text-xs font-black uppercase tracking-wider block mb-1">
            Store Catalog
          </span>
          <h1 className="text-2xl sm:text-4xl font-black capitalize tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 font-medium">
            {activeCategoryObj?.description || 'Explore authentic cosmetics, skincare serums, hoodies, and luxury accessories across Pakistan.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Panel */}
        <div className="lg:col-span-1 space-y-6 bg-white p-5 rounded-2xl border-2 border-gray-200 shadow-xs h-fit">
          <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
            <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
              <Filter className="w-4 h-4 text-brand-orange" />
              <span>Filters</span>
            </h3>
            <button 
              onClick={resetFilters}
              className="text-xs font-bold text-brand-orange hover:underline"
            >
              Reset Filters
            </button>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">Search Catalog</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2.5 text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">Category</label>
            <select 
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setSelectedSubCategory('all'); setCurrentPage(1); }}
              className="w-full p-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {activeCategoryObj?.subcategories?.length > 0 && (
            <div>
              <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
                Subcategory
              </label>
              <select 
                value={selectedSubCategory}
                onChange={e => { setSelectedSubCategory(e.target.value); setCurrentPage(1); }}
                className="w-full p-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold"
              >
                <option value="all">All {activeCategoryObj.name}</option>
                {activeCategoryObj.subcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
              <span>Max Price Limit</span>
              <span className="text-brand-orange">Rs. {priceRange.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="500" 
              max="15000" 
              step="500"
              value={priceRange} 
              onChange={e => setPriceRange(Number(e.target.value))}
              className="w-full accent-brand-orange cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">Brand</label>
            <select 
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="w-full p-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold"
            >
              {uniqueBrands.map(b => (
                <option key={b} value={b}>{b === 'all' ? 'All Brands' : b}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-200 font-bold text-xs">
            <label className="flex items-center space-x-2 text-gray-800 cursor-pointer">
              <input 
                type="checkbox"
                checked={onlyInStock}
                onChange={e => setOnlyInStock(e.target.checked)}
                className="rounded text-brand-orange focus:ring-brand-orange"
              />
              <span>In Stock Only</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-800 cursor-pointer">
              <input 
                type="checkbox"
                checked={onlyDiscounted}
                onChange={e => setOnlyDiscounted(e.target.checked)}
                className="rounded text-brand-orange focus:ring-brand-orange"
              />
              <span>Discounted Items</span>
            </label>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="text-xs font-bold text-gray-600">
              Found <strong className="text-gray-900">{filteredProducts.length}</strong> items
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold">
              <span className="text-gray-700">Sort By:</span>
              <select 
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-xl p-2 font-bold text-gray-900 outline-none"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="best-selling">Popular / Best Selling</option>
              </select>
            </div>
          </div>

          {/* Subcategory Quick Navigation Chips */}
          {activeCategoryObj?.subcategories?.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-black text-gray-800 uppercase tracking-wider">
                  Subcategories in {activeCategoryObj.name}
                </p>
                {selectedSubCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedSubCategory('all')}
                    className="text-[11px] font-bold text-brand-orange hover:underline"
                  >
                    View All
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedSubCategory('all'); setCurrentPage(1); }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition border-2 ${
                    selectedSubCategory === 'all'
                      ? 'bg-brand-black text-brand-orange border-brand-orange'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-brand-orange hover:text-brand-orange'
                  }`}
                >
                  All
                </button>
                {activeCategoryObj.subcategories.map(sub => {
                  const count = products.filter(p =>
                    (p.subcategoryId || p.subcategory) === sub.id &&
                    (p.categoryId || p.category) === activeCategoryObj.id
                  ).length;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => { setSelectedSubCategory(sub.id); setCurrentPage(1); }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition border-2 ${
                        selectedSubCategory === sub.id
                          ? 'bg-brand-orange text-white border-brand-orange shadow'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-brand-orange hover:text-brand-orange'
                      }`}
                    >
                      {sub.name}
                      {count > 0 && <span className="ml-1.5 opacity-70">({count})</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-gray-200 space-y-3">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-black text-gray-900">No products match your filters</h3>
              <button 
                onClick={resetFilters}
                className="bg-brand-orange text-white text-xs font-black px-6 py-3 rounded-xl shadow"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-2.5 rounded-xl border border-gray-300 text-gray-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition ${
                    currentPage === i + 1 
                      ? "bg-brand-orange text-white shadow-md" 
                      : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2.5 rounded-xl border border-gray-300 text-gray-700 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
