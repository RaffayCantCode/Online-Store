import React, { useState } from 'react';

export const StoreLogo = ({ className = "h-14 sm:h-16 md:h-20", isDarkBg = false }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center select-none">
      {!imgError ? (
        <div className="relative flex items-center justify-start overflow-visible">
          <img
            src="/logo.png"
            alt="Taskeen Variety Store Logo"
            onError={() => setImgError(true)}
            className={`${className} w-auto object-contain transition-opacity duration-300 group-hover:opacity-90 ${
              isDarkBg ? "bg-white p-1 rounded-lg" : ""
            }`}
          />
        </div>
      ) : (
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-brand-black text-brand-orange font-black flex items-center justify-center text-xl shadow-md border-2 border-brand-orange shrink-0">
            T
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className={`text-xl sm:text-2xl font-black tracking-tight group-hover:text-brand-orange transition-colors ${
                isDarkBg ? "text-white" : "text-gray-900"
              }`}>
                Taskeen
              </span>
              <span className="bg-brand-orange text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg tracking-wider uppercase">
                STORE
              </span>
            </div>
            <p className={`text-[10px] font-extrabold hidden sm:block ${isDarkBg ? "text-gray-400" : "text-gray-500"}`}>
              Variety & Authentic Products PK
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
