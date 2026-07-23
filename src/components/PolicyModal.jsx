import React from 'react';
import { X, ShieldCheck, Truck, RefreshCw, FileText, Lock } from 'lucide-react';

export const PolicyModal = ({ activePolicy, onClose }) => {
  if (!activePolicy) return null;

  const contentMap = {
    cod: {
      title: "Cash on Delivery (COD) Policy",
      icon: Truck,
      details: [
        "We offer Cash on Delivery (COD) across all cities and towns in Pakistan through express couriers (TCS, Leopards, PostEx).",
        "Please keep exact cash ready upon arrival of the courier rider to prevent delivery delays.",
        "Delivery verification calls or SMS notifications will be sent prior to parcel dispatch."
      ]
    },
    exchange: {
      title: "7-Day Easy Exchange Policy",
      icon: RefreshCw,
      details: [
        "If you receive a defective, damaged, or incorrect item, you can request a replacement within 7 days of delivery.",
        "Items must be unused, unwashed, and in their original packaging with tags intact.",
        "Contact our Customer Support via WhatsApp/Phone (0333-5517321) or Email (maryam12mzzzz@gmail.com) with order reference."
      ]
    },
    terms: {
      title: "Terms & Conditions",
      icon: FileText,
      details: [
        "All product prices listed on Taskeen Variety Store are in Pakistani Rupees (PKR) and inclusive of applicable taxes.",
        "Orders are processed within 24 hours of placement during business days.",
        "Taskeen Variety Store reserves the right to cancel orders in case of invalid contact details or out-of-stock items."
      ]
    },
    privacy: {
      title: "Privacy & Data Protection Policy",
      icon: Lock,
      details: [
        "Your personal contact information (name, address, phone number) is strictly encrypted and used solely for fulfilling your orders.",
        "We do not sell, rent, or share customer data with third parties except authorized shipping partners (couriers).",
        "Online transactions are secured with 256-bit SSL encryption standards."
      ]
    }
  };

  const currentData = contentMap[activePolicy] || contentMap.cod;
  const IconComp = currentData.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />

      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-50 border-2 border-gray-200 animate-fade-in space-y-5">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b-2 border-gray-100 pb-4">
          <div className="w-10 h-10 bg-orange-100 text-brand-orange rounded-2xl flex items-center justify-center font-bold">
            <IconComp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">{currentData.title}</h3>
            <p className="text-[11px] text-gray-500 font-bold">Taskeen Variety Store Customer Help</p>
          </div>
        </div>

        <div className="space-y-3 text-xs font-bold text-gray-700 leading-relaxed">
          {currentData.details.map((paragraph, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <span className="text-brand-orange font-black mt-0.5">•</span>
              <p>{paragraph}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-brand-orange text-white text-xs font-black px-6 py-2.5 rounded-xl shadow hover:bg-brand-orange-hover transition"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
