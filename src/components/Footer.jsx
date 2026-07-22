import React from 'react';
import { useStore } from '../context/StoreContext';
import { StoreLogo } from './StoreLogo';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  const { homepageConfig, setCurrentView, setSelectedCategory } = useStore();

  return (
    <footer className="bg-brand-black text-gray-400 text-xs border-t-2 border-brand-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => setCurrentView('home')}
              className="cursor-pointer inline-block"
            >
              <StoreLogo className="h-10" />
            </div>

            <p className="text-gray-300 text-xs leading-relaxed max-w-sm font-medium">
              Your premier online destination for authentic clothing, makeup, skincare serums, and lifestyle accessories in Pakistan. Cash on Delivery available nationwide.
            </p>

            <div className="space-y-2 text-xs font-semibold text-gray-300">
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Liberty Market Outlet / Express Shipping PK</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Helpline: 0300-1234567</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <span>support@taskeenvarietystore.com</span>
              </p>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              Shop Categories
            </h3>
            <ul className="space-y-2.5 font-bold">
              {['Beauty & Makeup', 'Skincare Essentials', 'Fashion Apparel', 'Accessories & Watches'].map((cat, i) => (
                <li key={i}>
                  <button 
                    onClick={() => {
                      setSelectedCategory(cat.toLowerCase().includes('skincare') ? 'skincare' : 'beauty');
                      setCurrentView('shop');
                    }}
                    className="hover:text-brand-orange transition"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              Customer Help
            </h3>
            <ul className="space-y-2.5 font-bold">
              {['Track Order Status', 'Cash on Delivery Policy', '7-Day Easy Exchange', 'Terms & Conditions', 'Privacy Policy'].map((item, i) => (
                <li key={i}>
                  <a href="#help" onClick={(e) => { e.preventDefault(); setCurrentView('shop'); }} className="hover:text-brand-orange transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Payment Gateways */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              Payment Options
            </h3>
            <p className="text-[11px] text-gray-400 mb-3 font-semibold">
              Safe & Reliable Delivery across Pakistan.
            </p>
            <div className="flex flex-wrap gap-2 text-white">
              <span className="bg-brand-orange text-white px-3 py-1 rounded font-black text-xs">Cash On Delivery</span>
              <span className="bg-gray-800 border border-gray-700 px-2.5 py-1 rounded font-bold text-[10px] text-pink-400">JazzCash</span>
              <span className="bg-gray-800 border border-gray-700 px-2.5 py-1 rounded font-bold text-[10px] text-green-400">EasyPaisa</span>
              <span className="bg-gray-800 border border-gray-700 px-2.5 py-1 rounded font-bold text-[10px]">Bank Transfer</span>
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
    </footer>
  );
};
