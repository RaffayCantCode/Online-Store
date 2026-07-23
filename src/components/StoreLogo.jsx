import React, { useState } from 'react';

export const StoreLogo = ({ className = "h-16 sm:h-20 md:h-22", isDarkBg = false }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center select-none py-1">
      {!imgError ? (
        <div className="relative flex items-center justify-start overflow-visible min-w-[120px]">
          <img 
            src="/logo.png" 
            alt="Taskeen Variety Store Logo" 
            onError={() => setImgError(true)}
            className={isDarkBg 
              ? "h-16 w-auto object-contain transition-opacity duration-300 group-hover:opacity-90 origin-left scale-[2.2] bg-white p-1.5 rounded-xl border border-white/30 shadow-md -translate-y-0.5" 
              : "h-16 sm:h-20 md:h-24 w-auto object-contain transition-opacity duration-300 group-hover:opacity-90 origin-left scale-[2.2] sm:scale-[2.6] md:scale-[2.8] -translate-y-0.5"
            }
          />
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-black text-brand-orange font-black flex items-center justify-center text-2xl shadow-md border-2 border-brand-orange">
            T
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white group-hover:text-brand-orange transition-colors">
                Taskeen
              </span>
              <span className="bg-brand-orange text-white text-xs font-black px-2 py-0.5 rounded-lg tracking-wider uppercase">
                STORE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-extrabold hidden sm:block">
              Variety & Authentic Products PK
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
