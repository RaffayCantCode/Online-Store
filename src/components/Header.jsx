import React from 'react';
import { useStore } from '../context/StoreContext';
import { StoreLogo } from './StoreLogo';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  ShieldAlert, 
  ChevronDown, 
  Phone,
  Truck,
  Sliders,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

export const Header = () => {
  const { 
    homepageConfig, 
    cart, 
    user, 
    isAdmin,
    theme,
    toggleTheme,
    setIsCartOpen, 
    setIsMobileDrawerOpen, 
    setIsSearchModalOpen,
    setIsAuthModalOpen,
    currentView,
    setCurrentView,
    setSelectedCategory,
    selectedCategory,
    setShopFilter,
    categories
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="relative z-40 bg-white border-b-2 border-gray-200 shadow-sm">
      {/* 1. Announcement Bar */}
      <div className="bg-brand-black text-white text-xs py-2 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <p className="flex items-center space-x-2 font-bold text-center sm:text-left text-brand-orange">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{homepageConfig?.announcementText || "⚡ Free Delivery Across Pakistan on Orders Over Rs. 3,000 | Cash on Delivery (COD) Available!"}</span>
          </p>
          <div className="hidden md:flex items-center space-x-6 text-gray-300 font-semibold">
            <span className="flex items-center space-x-1 hover:text-white">
              <Phone className="w-3.5 h-3.5 text-brand-orange" />
              <a href="tel:03335517321">Helpline: 0333-5517321</a>
            </span>
            <span className="flex items-center space-x-1">
              <Truck className="w-3.5 h-3.5 text-brand-orange" />
              <span>Cash on Delivery</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-4 sm:gap-6 overflow-visible">
        {/* Mobile Hamburger, Theme Toggle & Logo */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <button 
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-gray-100 text-gray-900 border-2 border-gray-300 hover:bg-gray-200 focus:outline-none flex items-center space-x-1"
            aria-label="Open Category Menu"
          >
            <Menu className="w-5 h-5 text-brand-black" />
          </button>

          {/* Theme Toggle - Left side */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition shrink-0"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Standalone Logo Link */}
          <div 
            onClick={() => setCurrentView('home')}
            className="cursor-pointer group p-0 m-0 flex items-center"
          >
            <StoreLogo className="h-10 sm:h-11 md:h-12" />
          </div>
        </div>

        {/* Big Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div 
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full flex items-center bg-gray-100 border-2 border-gray-300 hover:border-brand-orange rounded-2xl py-3 px-4 cursor-pointer transition text-gray-500 font-semibold shadow-xs"
          >
            <Search className="w-5 h-5 text-brand-orange mr-2.5 shrink-0" />
            <span className="text-sm font-bold text-gray-700 truncate">Search Cosmetics, Serums, Hoodies...</span>
            <span className="ml-auto bg-brand-black text-white text-[11px] px-3 py-1 rounded-xl font-black uppercase shrink-0">Search</span>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Mobile Search Button */}
          <button 
            onClick={() => setIsSearchModalOpen(true)}
            className="md:hidden p-2.5 rounded-xl bg-gray-100 border border-gray-300 text-gray-900"
            aria-label="Search Catalog"
          >
            <Search className="w-5 h-5 text-brand-orange" />
          </button>

          {/* Role-Based Admin Shortcut - Visible ONLY when logged in as Admin */}
          {isAdmin && (
            <button 
              onClick={() => setCurrentView('admin')}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition border-2 bg-brand-black text-brand-orange border-brand-orange shadow-md"
              title="Open Admin Dashboard"
            >
              <Sliders className="w-4 h-4 text-brand-orange" />
              <span className="hidden sm:inline">Admin Dashboard</span>
            </button>
          )}

          {/* Account Button */}
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="p-2.5 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 hover:bg-gray-200 transition relative"
            title={user ? `Account: ${user.name}` : "Sign In"}
          >
            <User className="w-5 h-5" />
            {user && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {/* Cart Button */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-2 bg-brand-orange hover:bg-brand-orange-hover text-white px-4 py-2.5 rounded-xl font-extrabold text-sm transition shadow-md focus:outline-none active:scale-95 border-2 border-brand-orange"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            <span className="bg-white text-brand-orange text-xs font-black px-2 py-0.5 rounded-full shadow-xs">
              {totalCartCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Category Navigation Bar */}
      <nav className="hidden lg:block bg-brand-black text-white text-sm font-bold border-t-2 border-brand-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-8 h-12">
          {/* Categories Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-2 bg-brand-orange text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-lg hover:bg-brand-orange-hover transition shadow-sm">
              <Menu className="w-4 h-4" />
              <span>All Categories</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Categories Dropdown */}
            <div className="absolute top-full left-0 w-64 bg-white text-gray-900 rounded-b-2xl shadow-2xl border-2 border-gray-200 hidden group-hover:block z-50 py-2">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="relative group/sub"
                >
                  <div
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setShopFilter('all');
                      setCurrentView('shop');
                    }}
                    className="flex items-center justify-between px-4 py-3 text-sm font-bold hover:bg-orange-100 hover:text-brand-orange cursor-pointer border-b border-gray-100 transition"
                  >
                    <span>{cat.name}</span>
                    {cat.subcategories?.length > 0 && (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 -rotate-90 shrink-0" />
                    )}
                  </div>

                  {/* Subcategories nested dropdown */}
                  {cat.subcategories?.length > 0 && (
                    <div className="absolute top-0 left-full ml-0 w-56 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 hidden group-hover/sub:block z-50 py-2">
                      <p className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-brand-orange border-b border-gray-100">
                        {cat.name}
                      </p>
                      {cat.subcategories.map(sub => (
                        <div 
                          key={sub.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setShopFilter('all');
                            setCurrentView('shop');
                          }}
                          className="px-4 py-2.5 text-sm font-semibold hover:bg-orange-100 hover:text-brand-orange cursor-pointer border-b border-gray-100 last:border-0 transition"
                        >
                          {sub.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <button 
            onClick={() => { setCurrentView('home'); }}
            className={`hover:text-brand-orange transition py-3 ${currentView === 'home' ? 'text-brand-orange font-black border-b-4 border-brand-orange' : 'text-gray-200'}`}
          >
            Home
          </button>
          
          <button 
            onClick={() => { setSelectedCategory('all'); setShopFilter('all'); setCurrentView('shop'); }}
            className={`hover:text-brand-orange transition py-3 ${currentView === 'shop' && selectedCategory === 'all' ? 'text-brand-orange font-black border-b-4 border-brand-orange' : 'text-gray-200'}`}
          >
            Shop All Catalog
          </button>

          {categories.slice(0, 5).map((cat) => {
            const isSelected = currentView === 'shop' && selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setShopFilter('all'); setCurrentView('shop'); }}
                className={`transition py-3 whitespace-nowrap ${isSelected ? 'text-brand-orange font-black border-b-4 border-brand-orange' : 'text-gray-200 hover:text-brand-orange'}`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
