import React, { useState } from 'react';

export const StoreLogo = ({ className = "h-24 sm:h-32 md:h-36 lg:h-40" }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center select-none py-1">
      {!imgError ? (
        /* Standalone Huge Full Brand Logo Image */
        <img 
          src="/logo.png" 
          alt="Taskeen Variety Store Logo" 
          onError={() => setImgError(true)}
          className={`${className} w-auto max-h-[160px] object-contain transition-transform duration-300 group-hover:scale-105 origin-left scale-[1.7] my-2`}
        />
      ) : (
        /* Fallback stylized brand badge if image not found */
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-2xl bg-brand-black text-brand-orange font-black flex items-center justify-center text-3xl shadow-md border-2 border-brand-orange">
            T
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 group-hover:text-brand-orange transition-colors">
                Taskeen
              </span>
              <span className="bg-brand-orange text-white text-xs sm:text-sm font-black px-3 py-1 rounded-xl tracking-wider uppercase">
                STORE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-extrabold hidden md:block">
              Variety & Authentic Products PK
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
