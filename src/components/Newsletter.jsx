import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Send, Sparkles } from 'lucide-react';

export const Newsletter = () => {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast("Please enter a valid email address", "error");
      return;
    }
    showToast("Thank you for subscribing to Taskeen Store VIP Club!");
    setEmail('');
  };

  return (
    <section className="bg-brand-black text-white py-12 relative overflow-hidden border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-gray-900 to-brand-dark p-8 sm:p-12 rounded-3xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center space-x-1.5 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Join Taskeen VIP Club</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Get 15% OFF Your First Order & Exclusive Deal Alerts
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Subscribe to receive instant updates on new cosmetics, clothing collections, flash sales, and subscriber coupons.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:w-auto flex-1 max-w-md">
            <div className="flex flex-col sm:flex-row gap-2 bg-gray-800/80 p-1.5 rounded-2xl border border-gray-700">
              <div className="flex items-center px-3 flex-1">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full text-sm bg-transparent text-white outline-none placeholder:text-gray-500 py-2"
                />
              </div>
              <button 
                type="submit"
                className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-2 shrink-0"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-2 text-center sm:text-left">
              No spam guaranteed. Unsubscribe anytime in one click.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
