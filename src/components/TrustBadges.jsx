import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones, Award } from 'lucide-react';

export const TrustBadges = () => {
  const badges = [
    {
      icon: Truck,
      title: "Free Express Shipping",
      description: "On all store orders above $50"
    },
    {
      icon: RotateCcw,
      title: "30-Day Money Back",
      description: "Hassle-free 100% returns guarantee"
    },
    {
      icon: ShieldCheck,
      title: "100% Secure Checkout",
      description: "Encrypted card & mobile payment"
    },
    {
      icon: Headphones,
      title: "24/7 Customer Care",
      description: "Dedicated friendly live support"
    }
  ];

  return (
    <section className="bg-white border-y border-gray-100 py-8 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((b, i) => {
            const IconComponent = b.icon;
            return (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50/60 hover:bg-orange-50/40 border border-gray-100 transition group">
                <div className="w-12 h-12 rounded-xl bg-brand-black text-brand-orange group-hover:bg-brand-orange group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-brand-orange transition-colors">
                    {b.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
