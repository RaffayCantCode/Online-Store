import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  ChevronRight, 
  ChevronDown, 
  ShoppingBag, 
  Heart, 
  User, 
  Sliders, 
  Sparkles,
  Phone,
  Mail,
  Home
} from 'lucide-react';

export const MobileDrawer = () => {
  const { 
    isMobileDrawerOpen, 
    setIsMobileDrawerOpen, 
    categories, 
    setCurrentView, 
    setSelectedCategory,
    user,
    isAdmin,
    setIsAuthModalOpen,
    wishlist,
    cart
  } = useStore();

  const [expandedCategories, setExpandedCategories] = useState({});

  if (!isMobileDrawerOpen) return null;

  const toggleCategoryExpand = (catId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setCurrentView('shop');
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop overlay */}
      <div 
        onClick={() => setIsMobileDrawerOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50 animate-slide-in-left">
        {/* Drawer Header */}
        <div className="bg-brand-black text-white p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-orange text-white font-extrabold flex items-center justify-center text-lg">
              T
            </div>
            <div>
              <h2 className="font-extrabold text-base leading-tight">Taskeen Store</h2>
              <p className="text-[10px] text-gray-400">Mobile Navigation</p>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileDrawerOpen(false)}
            className="p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick User Banner */}
        <div className="bg-orange-50 border-b border-orange-100 p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-brand-orange" />
            <span className="text-xs font-semibold text-gray-800">
              {user ? user.name : "Welcome Guest"}
            </span>
          </div>
          <button 
            onClick={() => {
              setIsAuthModalOpen(true);
              setIsMobileDrawerOpen(false);
            }}
            className="text-xs text-brand-orange hover:underline font-bold"
          >
            {user ? "Account" : "Sign In"}
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {/* Main View Links */}
          <button 
            onClick={() => { setCurrentView('home'); setIsMobileDrawerOpen(false); }}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            <Home className="w-4 h-4 text-gray-500" />
            <span>Homepage</span>
          </button>

          <button 
            onClick={() => { setSelectedCategory('all'); setCurrentView('shop'); setIsMobileDrawerOpen(false); }}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            <ShoppingBag className="w-4 h-4 text-gray-500" />
            <span>Shop All Catalog</span>
          </button>

          {/* Admin Dashboard Shortcut - Visible ONLY when logged in as Admin */}
          {isAdmin && (
            <button 
              onClick={() => { setCurrentView('admin'); setIsMobileDrawerOpen(false); }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition border bg-brand-black text-brand-orange border-brand-orange"
            >
              <Sliders className="w-4 h-4 text-brand-orange" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <div className="pt-3 pb-1 border-t border-gray-100">
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Browse Categories
            </p>
          </div>

          {/* Dynamic Unlimited Nested Categories Accordion */}
          {categories.map((cat) => {
            const isExpanded = expandedCategories[cat.id];
            return (
              <div key={cat.id} className="rounded-lg overflow-hidden border border-gray-100">
                <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50/50 hover:bg-gray-100 transition">
                  <button 
                    onClick={() => handleSelectCategory(cat.id)}
                    className="flex-1 text-left text-sm font-semibold text-gray-800 hover:text-brand-orange"
                  >
                    {cat.name}
                  </button>
                  {cat.subcategories?.length > 0 && (
                    <button 
                      onClick={() => toggleCategoryExpand(cat.id)}
                      className="p-1 rounded text-gray-400 hover:text-gray-700"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Subcategories Expansion */}
                {isExpanded && cat.subcategories?.length > 0 && (
                  <div className="bg-white px-3 py-1 space-y-1 border-t border-gray-100">
                    <button 
                      onClick={() => handleSelectCategory(cat.id)}
                      className="w-full text-left py-1.5 px-2 text-xs font-semibold text-brand-orange hover:underline"
                    >
                      • View All {cat.name}
                    </button>
                    {cat.subcategories.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => handleSelectCategory(cat.id)}
                        className="w-full text-left py-1.5 px-2 text-xs text-gray-600 hover:text-brand-orange hover:bg-orange-50/50 rounded transition"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer Contact Info */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 space-y-2">
          <div className="flex items-center space-x-2">
            <Phone className="w-3.5 h-3.5 text-brand-orange" />
            <span>Support: +1 (800) 555-TASKEEN</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-3.5 h-3.5 text-brand-orange" />
            <span>support@taskeenvarietystore.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};
