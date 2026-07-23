import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { MobileDrawer } from './components/MobileDrawer';
import { SearchModal } from './components/SearchModal';
import { HeroBanner } from './components/HeroBanner';
import { CategorySection } from './components/CategorySection';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { PromoBanners } from './components/PromoBanners';
import { ReviewsSection } from './components/ReviewsSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { ShopPage } from './components/ShopPage';
import { AdminDashboard } from './components/AdminPanel/AdminDashboard';
import { Sparkles, ArrowRight, Flame, Award } from 'lucide-react';

const MainLayout = () => {
  const { currentView, setCurrentView, products, selectedCategory, shopFilter, setShopFilter, setSelectedCategory, toastMessage, isLoading } = useStore();

  // Always scroll to top whenever page view or filter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedCategory, shopFilter]);

  // Robust product rows: ensure 4 items are always displayed
  let bestSellers = products.filter(p => p.isBestSeller);
  if (bestSellers.length < 4) {
    const remaining = products.filter(p => !bestSellers.some(b => b.id === p.id));
    bestSellers = [...bestSellers, ...remaining];
  }
  bestSellers = bestSellers.slice(0, 4);

  let trendingProducts = products.filter(p => p.isTrending);
  if (trendingProducts.length < 4) {
    const remaining = products.filter(p => !trendingProducts.some(t => t.id === p.id));
    trendingProducts = [...trendingProducts, ...remaining];
  }
  trendingProducts = trendingProducts.slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-500">Loading store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 selection:bg-brand-orange selection:text-white">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl text-xs font-extrabold flex items-center space-x-2 animate-fade-in border ${
          toastMessage.type === 'error' 
            ? 'bg-red-600 text-white border-red-700' 
            : 'bg-brand-black text-brand-orange border-brand-orange'
        }`}>
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Global Header */}
      <Header />

      {/* Global Modals & Drawers */}
      <MobileDrawer />
      <SearchModal />
      <CartDrawer />
      <ProductModal />
      <AuthModal />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div>
            {/* 1. Hero Banner */}
            <HeroBanner />

            {/* 2. Featured Categories */}
            <CategorySection />

            {/* 4. Best Sellers Section */}
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-gray-200">
                  <div>
                    <span className="text-brand-orange text-xs font-bold uppercase tracking-wider block mb-1">
                      Customer Favorites
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
                      <span>Best Sellers</span>
                      <Award className="w-6 h-6 text-brand-orange" />
                    </h2>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedCategory('all');
                      setShopFilter('bestseller');
                      setCurrentView('shop');
                    }}
                    className="inline-flex items-center space-x-1 text-sm font-bold text-brand-orange hover:underline mt-2 sm:mt-0"
                  >
                    <span>View All Best Sellers</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  {bestSellers.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Promotional Banners */}
            <PromoBanners />

            {/* 6. Trending Products */}
            <section className="py-12 bg-gray-50 border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-gray-200">
                  <div>
                    <span className="text-brand-orange text-xs font-bold uppercase tracking-wider block mb-1">
                      Hot This Season
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
                      <span>Trending Now</span>
                      <Flame className="w-6 h-6 text-brand-orange" />
                    </h2>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedCategory('all');
                      setShopFilter('trending');
                      setCurrentView('shop');
                    }}
                    className="inline-flex items-center space-x-1 text-sm font-bold text-brand-orange hover:underline mt-2 sm:mt-0"
                  >
                    <span>Explore Trending Deals</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  {trendingProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>

            {/* 7. Customer Reviews */}
            <ReviewsSection />

            {/* 8. VIP Newsletter */}
            <Newsletter />
          </div>
        )}

        {currentView === 'shop' && <ShopPage />}
        {currentView === 'checkout' && <CheckoutModal />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}

export default App;
