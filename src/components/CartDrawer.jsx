import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  Check
} from 'lucide-react';

export const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQty, 
    appliedCoupon, 
    applyCouponCode,
    setCurrentView
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  // Calculations in PKR (Rs.)
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  // Free shipping on orders over Rs. 3,000, else flat Rs. 250
  const freeShippingThreshold = 3000;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 250;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCouponCode(couponInput);
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-50 animate-slide-in-right">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-brand-black text-white flex items-center justify-between border-b-2 border-brand-orange">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-brand-orange" />
            <h2 className="font-extrabold text-lg">Your Shopping Cart</h2>
            <span className="bg-brand-orange text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-orange-50 px-4 py-3 border-b border-orange-200 text-xs text-center font-bold text-gray-900">
          {subtotal >= freeShippingThreshold ? (
            <span className="text-green-700 font-extrabold flex items-center justify-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Congratulations! You get FREE Delivery across Pakistan!</span>
            </span>
          ) : (
            <span>
              Add <strong className="text-brand-orange">Rs. {(freeShippingThreshold - subtotal).toLocaleString()}</strong> more for <strong>FREE Shipping</strong>!
            </span>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-lg font-black text-gray-900">Your cart is empty</p>
              <p className="text-xs text-gray-500 mt-1">Browse our cosmetics, skincare, and apparel catalog!</p>
              <button 
                onClick={() => {
                  setCurrentView('shop');
                  setIsCartOpen(false);
                }}
                className="mt-6 inline-flex items-center space-x-2 bg-brand-orange text-white text-xs font-black px-6 py-3.5 rounded-xl shadow"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={`${item.id}-${index}`}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl border border-gray-300 relative"
              >
                <img 
                  src={item.images?.[0]} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-xl border border-gray-300 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-extrabold text-gray-900 truncate">
                    {item.name}
                  </h4>
                  <div className="text-[11px] font-semibold text-gray-500 mt-0.5">
                    Rs. {item.price.toLocaleString()} x {item.quantity}
                  </div>
                  <div className="text-sm font-black text-brand-orange mt-1">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="text-gray-400 hover:text-red-600 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <button 
                      onClick={() => updateCartQty(index, -1)}
                      className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 py-0.5 text-xs font-black text-gray-900">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateCartQty(index, 1)}
                      className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Breakdown Footer */}
        {cart.length > 0 && (
          <div className="p-4 bg-gray-50 border-t-2 border-gray-200 space-y-3">
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="flex-1 relative">
                <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon Code (e.g. TASKEEN10)"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-xl outline-none font-bold uppercase"
                />
              </div>
              <button 
                type="submit"
                className="bg-brand-black text-white text-xs font-black px-4 py-2 rounded-xl"
              >
                APPLY
              </button>
            </form>

            {appliedCoupon && (
              <div className="flex justify-between text-xs bg-green-100 text-green-800 p-2 rounded-lg font-bold">
                <span>Coupon '{appliedCoupon.code}'</span>
                <span>-Rs. {discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="space-y-1.5 text-xs font-bold text-gray-700 border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>{shippingFee === 0 ? <strong className="text-green-700">FREE</strong> : `Rs. ${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-300">
                <span>Total Amount</span>
                <span className="text-brand-orange">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setIsCartOpen(false);
                setCurrentView('checkout');
              }}
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-black py-4 px-4 rounded-2xl transition shadow-lg flex items-center justify-center space-x-2 text-base uppercase border-2 border-brand-orange"
            >
              <span>PROCEED TO CHECKOUT (COD)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
