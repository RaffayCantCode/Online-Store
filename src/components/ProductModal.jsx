import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Zap, 
  Truck, 
  ShieldCheck, 
  Plus, 
  Minus,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const ProductModal = () => {
  const { 
    selectedProductModal, 
    setSelectedProductModal, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    setCurrentView,
    setSelectedCategory,
    setShopFilter,
    categories,
    showToast
  } = useStore();

  const product = selectedProductModal;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const totalPrice = product.price * quantity;
  const inStock = product.inStock !== false && (product.stock ?? product.stock_count ?? 0) > 0;
  const productCategory = categories.find(c => c.id === (product.categoryId || product.category));
  const productSubcategory = productCategory?.subcategories?.find(s => s.id === (product.subcategoryId || product.subcategory));

  const handleCategoryClick = () => {
    if (productCategory) {
      setSelectedCategory(productCategory.id);
      setShopFilter('all');
      setCurrentView('shop');
      setSelectedProductModal(null);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setSelectedProductModal(null);
    setCurrentView('checkout');
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hello Taskeen Store! I want to order:\nProduct: ${product.name}\nQuantity: ${quantity}\nTotal: Rs. ${totalPrice.toLocaleString()}\nDelivery: Cash on Delivery`
    );
    window.open(`https://wa.me/923335517321?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4 md:p-6 flex items-center justify-center">
      <div 
        onClick={() => setSelectedProductModal(null)}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full mx-auto shadow-2xl border border-gray-200 z-50 animate-fade-in my-auto max-h-[96vh] flex flex-col overflow-hidden">
        {/* Close Button - positioned over the image gallery area */}
        <button 
          onClick={() => setSelectedProductModal(null)}
          className="absolute top-4 left-4 z-30 p-2.5 rounded-full bg-white/95 text-gray-900 shadow-lg hover:bg-white border border-gray-200 transition hover:scale-105"
          aria-label="Close detail modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Gallery Section */}
            <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl bg-white overflow-hidden border border-gray-200 relative shadow-inner">
                  <img 
                    src={product.images[activeImageIndex] || product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                  {product.discountPercentage > 0 && (
                    <span className="absolute top-4 left-4 bg-brand-orange text-white text-xs sm:text-sm font-black px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>{product.discountPercentage}% OFF</span>
                    </span>
                  )}
                </div>

                {product.images?.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {product.images.filter(Boolean).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                          activeImageIndex === idx 
                            ? "border-brand-orange ring-2 ring-orange-200 shadow-md" 
                            : "border-gray-200 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-3 shadow-sm">
                  <div className="flex items-center space-x-3 text-sm text-gray-700">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-xs">Free Delivery</p>
                      <p className="text-xs text-gray-500">Across Pakistan on orders over Rs. 3,000</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-700">
                    <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-xs">100% Authentic</p>
                      <p className="text-xs text-gray-500">Original products guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
              <div className="space-y-5">
                {/* Brand + Category + Stock */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {product.brand && (
                      <span className="font-black text-brand-orange uppercase text-[11px] sm:text-xs tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                        {product.brand}
                      </span>
                    )}
                    <button
                      onClick={handleCategoryClick}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold capitalize text-[11px] sm:text-xs border border-gray-200 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition"
                    >
                      {productCategory?.name || product.categoryId || product.category || 'General'}
                    </button>
                    {productSubcategory && (
                      <span className="bg-orange-50 text-brand-orange px-3 py-1 rounded-full font-black capitalize text-[11px] sm:text-xs border border-orange-200">
                        {productSubcategory.name}
                      </span>
                    )}
                  </div>
                  <span className={`flex items-center space-x-1 text-xs font-extrabold ${
                    inStock ? "text-green-700" : "text-red-600"
                  }`}>
                    {inStock ? (
                      <><CheckCircle className="w-4 h-4" /><span>In Stock</span></>
                    ) : (
                      <><AlertCircle className="w-4 h-4" /><span>Out of Stock</span></>
                    )}
                  </span>
                </div>

                {/* Product Name */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                  {product.name}
                </h2>

                {/* Description */}
                {product.description && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Price Display */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-200">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-3xl sm:text-4xl font-black text-gray-900">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-base sm:text-lg text-gray-400 line-through font-bold">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {product.originalPrice > product.price && (
                    <p className="text-xs font-black text-green-700 mt-1">
                      You save Rs. {(product.originalPrice - product.price).toLocaleString()}!
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-200" />

                {/* Color Selection */}
                {product.colors?.length > 0 && (
                  <div>
                    <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2.5">
                      Color: <span className="text-brand-orange normal-case">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition ${
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
                  <div>
                    <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2.5">
                      Size: <span className="text-brand-orange normal-case">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition ${
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

                {/* Quantity + Live Total Price */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label className="text-xs font-black text-gray-800 uppercase tracking-wider">
                        Qty:
                      </label>
                      <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 transition active:bg-gray-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 sm:px-5 py-2 text-base sm:text-lg font-black text-gray-900 bg-white min-w-[44px] text-center border-x-2 border-gray-200">
                          {quantity}
                        </span>
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 transition active:bg-gray-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total Price based on quantity */}
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total</p>
                      <p className="text-xl sm:text-2xl font-black text-brand-orange">
                        Rs. {totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      addToCart(product, selectedColor, selectedSize, quantity);
                      setSelectedProductModal(null);
                    }}
                    className="flex items-center justify-center space-x-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-black py-4 px-4 rounded-2xl transition shadow text-xs sm:text-sm border-2 border-brand-orange active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                    <span>ADD TO CART</span>
                  </button>

                  <button 
                    onClick={handleBuyNow}
                    className="flex items-center justify-center space-x-2 bg-brand-black hover:bg-gray-900 text-white font-black py-4 px-4 rounded-2xl transition shadow text-xs sm:text-sm border-2 border-brand-black active:scale-[0.98]"
                  >
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange shrink-0" />
                    <span>BUY NOW (COD)</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleWhatsAppOrder}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold py-3.5 px-4 rounded-2xl transition shadow flex items-center justify-center space-x-2 text-xs uppercase active:scale-[0.98]"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    <span>ORDER ON WHATSAPP</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-2xl border-2 transition shadow active:scale-[0.98] ${
                      isWishlisted
                        ? "bg-red-50 border-red-400 text-red-600"
                        : "bg-white border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50"
                    }`}
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-600" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
