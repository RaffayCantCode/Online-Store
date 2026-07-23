import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Heart, ShoppingBag, Eye, Percent, CheckCircle, AlertCircle } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setSelectedProductModal,
    trackProductView
  } = useStore();

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Product Image Area */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer">
        <img 
          src={product.images?.[0]} 
          alt={product.name} 
          onClick={() => { trackProductView(product.id); setSelectedProductModal(product); }}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercentage > 0 && (
            <span className="bg-brand-orange text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center space-x-0.5">
              <Percent className="w-3.5 h-3.5" />
              <span>{product.discountPercentage}% OFF</span>
            </span>
          )}
          {product.isTrending && (
            <span className="bg-brand-black text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
              🔥 Hot Seller
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md transition-colors z-10 ${
            isWishlisted 
              ? "bg-red-50 text-red-600 border-2 border-red-500" 
              : "bg-white text-gray-400 hover:text-red-500 hover:bg-white border border-gray-200"
          }`}
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-600" : ""}`} />
        </button>

        {/* Quick View Button */}
        <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center z-10">
          <button 
            onClick={() => { trackProductView(product.id); setSelectedProductModal(product); }}
            className="w-full py-2.5 bg-brand-black hover:bg-gray-900 text-white text-xs font-black rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition"
          >
            <Eye className="w-4 h-4 text-brand-orange" />
            <span>QUICK VIEW DETAILS</span>
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-extrabold text-brand-orange uppercase text-[10px]">
              {product.brand}
            </span>
            {isOutOfStock ? (
              <span className="text-red-600 text-[10px] font-extrabold flex items-center space-x-0.5">
                <AlertCircle className="w-3 h-3" />
                <span>Out of Stock</span>
              </span>
            ) : (
              <span className="text-green-700 text-[10px] font-extrabold flex items-center space-x-0.5">
                <CheckCircle className="w-3 h-3" />
                <span>In Stock</span>
              </span>
            )}
          </div>

          <h3 
            onClick={() => { trackProductView(product.id); setSelectedProductModal(product); }}
            className="text-base font-extrabold text-gray-900 line-clamp-2 hover:text-brand-orange cursor-pointer transition-colors leading-snug"
          >
            {product.name}
          </h3>

          <div className="flex items-center space-x-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-xs font-black text-gray-900">{product.rating}</span>
            <span className="text-xs text-gray-500 font-semibold">({product.reviewCount} Reviews)</span>
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
          <div>
            <span className="text-lg font-black text-gray-900">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="ml-1.5 text-xs text-gray-400 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button 
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
            className={`px-3 py-2 rounded-xl font-black text-xs transition-all flex items-center space-x-1.5 ${
              isOutOfStock 
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : "bg-brand-orange hover:bg-brand-orange-hover text-white shadow-md active:scale-95 border border-brand-orange"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">ADD TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
};
