import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Flame } from 'lucide-react';

export const PromoBanners = () => {
  const { homepageConfig, setSelectedCategory, setShopFilter, setCurrentView } = useStore();
  const promos = homepageConfig.promoBanners || [];

  const gridCols = promos.length === 1
    ? 'grid-cols-1'
    : promos.length === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  const handleCardClick = (promo) => {
    const filter = promo.filterType;
    if (filter && filter.startsWith('cat:')) {
      const catId = filter.replace('cat:', '');
      setSelectedCategory(catId);
      setShopFilter('all');
    } else if (filter) {
      setSelectedCategory('all');
      setShopFilter(filter);
    } else {
      const text = `${promo.badge || ''} ${promo.title || ''}`.toLowerCase();
      if (text.includes('new') || text.includes('arrival')) {
        setSelectedCategory('all');
        setShopFilter('new');
      } else if (text.includes('best') || text.includes('top')) {
        setSelectedCategory('all');
        setShopFilter('bestseller');
      } else {
        setSelectedCategory('all');
        setShopFilter('sale');
      }
    }
    setCurrentView('shop');
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid ${gridCols} gap-6`}>
          {promos.map((promo) => (
            <div 
              key={promo.id}
              onClick={() => handleCardClick(promo)}
              className={`relative rounded-3xl overflow-hidden shadow-lg border border-gray-200 cursor-pointer group p-8 sm:p-10 flex flex-col justify-between text-white bg-gradient-to-r ${promo.bgGradient}`}
              style={{ minHeight: promos.length <= 2 ? '260px' : '220px' }}
            >
              {/* Background Image Overlay */}
              <div className="absolute inset-0 z-0 opacity-25 group-hover:scale-105 transition-transform duration-700">
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
              </div>

              {/* Promo Content */}
              <div className="relative z-10">
                <span className="inline-flex items-center space-x-1 bg-white/20 text-white backdrop-blur-xs text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                  <Flame className="w-3.5 h-3.5 text-brand-orange animate-bounce" />
                  <span>{promo.badge}</span>
                </span>
                <h3 className={`font-black tracking-tight leading-snug max-w-md ${promos.length <= 2 ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                  {promo.title}
                </h3>
                <p className={`mt-2 font-normal max-w-sm ${promos.length <= 2 ? 'text-sm text-gray-200' : 'text-xs text-gray-300'}`}>
                  {promo.subtitle}
                </p>
              </div>

              {/* Action Link */}
              <div className="relative z-10 mt-6">
                <span className="inline-flex items-center space-x-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition shadow-md group-hover:translate-x-1">
                  <span>{promo.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
