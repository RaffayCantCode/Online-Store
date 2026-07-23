import React from 'react';
import { useStore } from '../context/StoreContext';
import { initialHomepageConfig } from '../data/initialData';
import { ShoppingBag, ArrowRight, ShieldCheck, Star, Sparkles } from 'lucide-react';

export const HeroBanner = () => {
  const { homepageConfig, setCurrentView, setSelectedCategory } = useStore();
  const hero = homepageConfig?.hero || initialHomepageConfig.hero;

  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      {/* Subtle Background Pattern & Gradient Overlay */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img 
          src={hero.bgImage} 
          alt="Taskeen Variety Store Hero" 
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-brand-orange/20 border border-brand-orange/40 text-brand-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hero.badgeText}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            {hero.title.split(' ').map((word, i) => 
              word.toLowerCase() === 'quality' || word.toLowerCase() === 'you\'ll' ? (
                <span key={i} className="text-brand-orange"> {word}</span>
              ) : ` ${word}`
            )}
          </h1>

          {/* Customizable Introduction */}
          <p className="text-base sm:text-lg text-gray-300 mb-8 font-normal leading-relaxed">
            {hero.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setCurrentView('shop');
              }}
              className="inline-flex items-center justify-center space-x-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 py-4 rounded-xl transition shadow-lg hover:shadow-orange-500/25 active:scale-95 text-base"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{hero.buttonText}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button 
              onClick={() => {
                setSelectedCategory('beauty');
                setCurrentView('shop');
              }}
              className="inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-4 rounded-xl transition border border-white/20 backdrop-blur-xs text-base"
            >
              <span>{hero.secondaryButtonText}</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-gray-800 grid grid-cols-3 gap-4 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
              <span className="font-semibold text-white">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-brand-orange" />
              <span className="font-semibold text-white">100% Genuine</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              <span className="font-semibold text-white">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
