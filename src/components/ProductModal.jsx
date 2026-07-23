import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  Zap, 
  Share2, 
  Truck, 
  ShieldCheck, 
  Check, 
  Plus, 
  Minus,
  MessageCircle
} from 'lucide-react';

export const ProductModal = () => {
  const { 
    selectedProductModal, 
    setSelectedProductModal, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    setCurrentView,
    products,
    showToast
  } = useStore();

  const product = selectedProductModal;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setSelectedProductModal(null);
    setCurrentView('checkout');
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hello Taskeen Store! I want to order:\nProduct: ${product.name}\nQuantity: ${quantity}\nTotal: Rs. ${(product.price * quantity).toLocaleString()}\nDelivery: Cash on Delivery`
    );
    window.open(`https://wa.me/923335517321?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-6 md:p-10 flex items-center justify-center">
      <div 
        onClick={() => setSelectedProductModal(null)}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full mx-auto shadow-2xl border-2 border-gray-200 z-50 animate-fade-in my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={() => setSelectedProductModal(null)}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-white/90 text-gray-900 shadow-md hover:bg-white border border-gray-300 transition"
          aria-label="Close detail modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="aspect-square max-h-[260px] sm:max-h-none mx-auto rounded-2xl bg-gray-100 overflow-hidden border-2 border-gray-200 relative">
                <img 
                  src={product.images[activeImageIndex] || product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-3 left-3 bg-brand-orange text-white text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {product.images?.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? "border-brand-orange ring-2 ring-orange-200" : "border-gray-200 opacity-70"
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-orange-50 rounded-2xl p-3 sm:p-4 border border-orange-200 text-xs text-gray-800 space-y-1.5">
                <div className="flex items-center space-x-2 font-bold text-[11px] sm:text-xs">
                  <Truck className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>Fast Delivery Across Pakistan (COD Available)</span>
                </div>
                <div className="flex items-center space-x-2 font-bold text-[11px] sm:text-xs">
                  <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>100% Original Authentic Product</span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-extrabold text-brand-orange uppercase text-[10px] sm:text-xs">
                    {product.brand}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full font-bold capitalize text-[10px] sm:text-xs">
                    {product.categoryId}
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-black text-gray-900 leading-tight">
                  {product.name}
                </h2>

                <div className="mt-3 flex items-baseline space-x-3">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs sm:text-base text-gray-400 line-through font-semibold">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Color Selection */}
                {product.colors?.length > 0 && (
                  <div className="mt-4 sm:mt-6">
                    <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
                      Color Options: <span className="text-brand-orange">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition ${
                            selectedColor === color 
                              ? "bg-brand-black text-white border-brand-black shadow" 
                              : "bg-white text-gray-800 border-gray-300 hover:border-brand-orange"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {product.sizes?.length > 0 && (
                  <div className="mt-3 sm:mt-4">
                    <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
                      Select Size: <span className="text-brand-orange">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition ${
                            selectedSize === size 
                              ? "bg-brand-orange text-white border-brand-orange shadow" 
                              : "bg-white text-gray-800 border-gray-300 hover:border-brand-orange"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mt-4 sm:mt-6 flex items-center space-x-4">
                  <label className="text-xs font-black text-gray-800 uppercase tracking-wider">
                    Quantity:
                  </label>
                  <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-gray-700 hover:bg-gray-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-black text-gray-900 bg-white min-w-[36px] text-center">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-gray-700 hover:bg-gray-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2.5 pt-2">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button 
                    onClick={() => {
                      addToCart(product, selectedColor, selectedSize, quantity);
                      setSelectedProductModal(null);
                    }}
                    className="flex items-center justify-center space-x-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-black py-3 sm:py-4 px-2 sm:px-4 rounded-xl sm:rounded-2xl transition shadow text-xs sm:text-sm border-2 border-brand-orange"
                  >
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span className="truncate">ADD TO CART</span>
                  </button>

                  <button 
                    onClick={handleBuyNow}
                    className="flex items-center justify-center space-x-1.5 bg-brand-black hover:bg-gray-900 text-white font-black py-3 sm:py-4 px-2 sm:px-4 rounded-xl sm:rounded-2xl transition shadow text-xs sm:text-sm border-2 border-brand-black"
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange shrink-0" />
                    <span className="truncate">BUY NOW (COD)</span>
                  </button>
                </div>

                {/* WhatsApp Fast Order Option */}
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 px-3 rounded-xl sm:rounded-2xl transition shadow flex items-center justify-center space-x-2 text-[11px] sm:text-xs uppercase"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>ORDER INSTANTLY ON WHATSAPP</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
