import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Send, Sparkles, Copy, Check, ShoppingBag, Gift } from 'lucide-react';

export const Newsletter = () => {
  const { showToast, coupons, addCoupon, applyCouponCode, setCurrentView, setSelectedCategory } = useStore();
  const [email, setEmail] = useState('');
  const [isSubscribedModalOpen, setIsSubscribedModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    // Ensure VIP15 coupon exists in store coupons
    const vipCouponExists = coupons.some(c => c.code.toUpperCase() === 'VIP15');
    if (!vipCouponExists) {
      addCoupon({
        id: `c-vip15`,
        code: 'VIP15',
        type: 'percentage',
        value: 15,
        minSpend: 1000,
        description: '15% OFF VIP Club Subscriber Discount',
        isActive: true
      });
    }

    // Auto copy VIP15 code
    navigator.clipboard?.writeText('VIP15');
    setIsSubscribedModalOpen(true);
    showToast("🎉 Welcome to Taskeen VIP Club! Code VIP15 copied!");
    setEmail('');
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('VIP15');
    setCopiedCode(true);
    showToast("Promo code VIP15 copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShopWithVIP = () => {
    applyCouponCode('VIP15');
    setIsSubscribedModalOpen(false);
    setSelectedCategory('all');
    setCurrentView('shop');
  };

  return (
    <section className="bg-brand-black text-white py-12 relative overflow-hidden border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-gray-900 via-brand-black to-gray-900 p-8 sm:p-12 rounded-3xl border-2 border-brand-orange/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center space-x-1.5 text-brand-orange text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Join Taskeen VIP Club</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Get 15% OFF Your First Order & Exclusive Deal Alerts
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 font-bold leading-relaxed">
              Subscribe to receive instant updates on new cosmetics, clothing collections, flash sales, and subscriber coupons.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:w-auto flex-1 max-w-md">
            <div className="flex flex-col sm:flex-row gap-2 bg-gray-800/90 p-2 rounded-2xl border-2 border-gray-700 shadow-inner">
              <div className="flex items-center px-3 flex-1">
                <Mail className="w-4 h-4 text-brand-orange mr-2 shrink-0" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full text-xs font-bold bg-transparent text-white outline-none placeholder:text-gray-400 py-2"
                />
              </div>
              <button 
                type="submit"
                className="bg-brand-orange hover:bg-brand-orange-hover text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-2 shrink-0 active:scale-95"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-2.5 text-center sm:text-left font-bold">
              ⚡ Instant 15% OFF promo code generated upon subscribing. No spam guaranteed.
            </p>
          </form>
        </div>
      </div>

      {/* VIP Club Subscriber Reward Modal */}
      {isSubscribedModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsSubscribedModalOpen(false)} />
          <div className="relative bg-white text-gray-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-50 border-2 border-brand-orange text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-brand-orange shadow-inner">
              <Gift className="w-8 h-8" />
            </div>

            <div>
              <span className="text-brand-orange text-xs font-black uppercase tracking-wider">Welcome to Taskeen VIP Club!</span>
              <h3 className="text-xl font-black text-gray-900 mt-1">Here is Your 15% OFF Code</h3>
              <p className="text-xs text-gray-500 font-bold mt-1">Use this exclusive discount code on your order at checkout.</p>
            </div>

            {/* Code Box */}
            <div className="bg-orange-50 p-4 rounded-2xl border-2 border-dashed border-brand-orange flex items-center justify-between">
              <span className="font-mono font-black text-2xl text-brand-orange tracking-widest">VIP15</span>
              <button 
                onClick={handleCopyCode}
                className="bg-brand-black hover:bg-gray-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 border border-brand-orange"
              >
                {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-brand-orange" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <button 
                onClick={handleShopWithVIP}
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-black py-3 rounded-xl shadow-lg transition text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Now & Apply 15% OFF</span>
              </button>

              <button 
                onClick={() => setIsSubscribedModalOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-600 font-bold underline block mx-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
