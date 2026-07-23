import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PolicyModal } from './PolicyModal';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  const { categories, setCurrentView, setSelectedCategory } = useStore();
  const [activePolicy, setActivePolicy] = useState(null);

  const handleHelpClick = (item) => {
    if (item === 'Track Order Status') {
      setCurrentView('checkout');
    } else if (item.includes('Cash on Delivery')) {
      setActivePolicy('cod');
    } else if (item.includes('Exchange')) {
      setActivePolicy('exchange');
    } else if (item.includes('Terms')) {
      setActivePolicy('terms');
    } else if (item.includes('Privacy')) {
      setActivePolicy('privacy');
    }
  };

  return (
    <footer className="bg-brand-black text-gray-400 text-xs border-t-2 border-brand-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => setCurrentView('home')}
              className="cursor-pointer inline-flex items-center space-x-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-black text-brand-orange font-black flex items-center justify-center text-2xl shadow-md border-2 border-brand-orange">
                T
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-black tracking-tight text-white group-hover:text-brand-orange transition-colors">
                    Taskeen
                  </span>
                  <span className="bg-brand-orange text-white text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase">
                    STORE
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-extrabold mt-0.5">
                  Variety & Authentic Products PK
                </p>
              </div>
            </div>

            <p className="text-gray-300 text-xs leading-relaxed max-w-sm font-medium">
              Your premier online destination for authentic clothing, makeup, skincare serums, and lifestyle accessories in Pakistan. Cash on Delivery available nationwide.
            </p>

            <div className="space-y-2.5 text-xs font-semibold text-gray-300">
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Liberty Market Outlet / Express Shipping PK</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="tel:03335517321" className="hover:text-brand-orange transition">Helpline: 0333-5517321</a>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="mailto:maryam12mzzzz@gmail.com" className="hover:text-brand-orange transition">maryam12mzzzz@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Dynamic Real Shop Categories */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              Shop Categories
            </h3>
            <ul className="space-y-2.5 font-bold">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button 
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentView('shop');
                    }}
                    className="hover:text-brand-orange transition text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Real Customer Help Links */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              Customer Help
            </h3>
            <ul className="space-y-2.5 font-bold">
              {['Track Order Status', 'Cash on Delivery Policy', '7-Day Easy Exchange', 'Terms & Conditions', 'Privacy Policy'].map((item, i) => (
                <li key={i}>
                  <button 
                    onClick={() => handleHelpClick(item)} 
                    className="hover:text-brand-orange transition text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Payment Options */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              Payment Options
            </h3>
            <p className="text-[11px] text-gray-400 mb-3 font-semibold">
              Safe & Reliable Delivery across Pakistan.
            </p>
            <div className="flex flex-wrap gap-2 text-white">
              <span className="bg-brand-orange text-white px-4 py-1.5 rounded-lg font-black text-xs shadow-sm">Cash On Delivery (COD)</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-bold">
          <p>© {new Date().getFullYear()} Taskeen Variety Store. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-green-500">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Genuine Verified Store PK</span>
            </span>
          </div>
        </div>
      </div>

      <PolicyModal 
        activePolicy={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </footer>
  );
};
