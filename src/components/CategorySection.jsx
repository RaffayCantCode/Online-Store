import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Grid } from 'lucide-react';

export const CategorySection = () => {
  const { categories, setSelectedCategory, setCurrentView } = useStore();
  const [orientations, setOrientations] = useState({});

  const handleImgLoad = (catId, e) => {
    const img = e.target;
    const isPortrait = img.naturalHeight > img.naturalWidth;
    setOrientations(prev => ({ ...prev, [catId]: isPortrait ? 'portrait' : 'landscape' }));
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center space-x-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
              <Grid className="w-4 h-4" />
              <span>Explore Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Featured Product Collections
            </h2>
          </div>
          <button 
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('shop');
            }}
            className="inline-flex items-center space-x-1 text-sm font-bold text-brand-orange hover:text-brand-orange-hover mt-2 sm:mt-0 transition group"
          >
            <span>Browse All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-auto">
          {categories.map((category) => {
            const isPortrait = orientations[category.id] === 'portrait';
            return (
              <div 
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentView('shop');
                }}
                className={`group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 bg-white cursor-pointer transition-all duration-300 ${isPortrait ? 'row-span-2' : ''}`}
              >
                {/* Category Image */}
                <div className={`w-full overflow-hidden bg-gray-100 relative ${isPortrait ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    onLoad={(e) => handleImgLoad(category.id, e)}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                {/* Text Info - dark gradient background for readability */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30 px-4 pt-8 pb-4 text-white">
                  <h3 className="text-lg font-bold group-hover:text-brand-orange transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-1 mt-0.5 font-normal">
                    {category.description}
                  </p>
                  <div className="mt-2 inline-flex items-center text-[11px] font-bold text-brand-orange group-hover:underline">
                    <span>Shop Collection</span>
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
