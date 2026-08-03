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
  Home,
  Sun,
  Moon
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
    theme,
    toggleTheme,
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

        {/* Theme Toggle Row - Middle Left */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Appearance</span>
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-300 hover:bg-gray-200 transition"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-gray-700">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-bold text-gray-700">Dark Mode</span>
              </>
            )}
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

          {/* Categories List */}
          {categories.map((cat) => (
            <div key={cat.id}>
              <button 
                onClick={() => cat.subcategories?.length > 0 ? toggleCategoryExpand(cat.id) : handleSelectCategory(cat.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-orange-50 hover:text-brand-orange transition flex items-center justify-between border border-gray-100"
              >
                <span>{cat.name}</span>
                {cat.subcategories?.length > 0 ? (
                  expandedCategories[cat.id]
                    ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>

              {/* Expandable Subcategories */}
              {cat.subcategories?.length > 0 && expandedCategories[cat.id] && (
                <div className="ml-4 mt-1 mb-1 space-y-1 border-l-2 border-orange-200 pl-2.5">
                  {cat.subcategories.map(sub => (
                    <button 
                      key={sub.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-orange-50 hover:text-brand-orange transition"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
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
