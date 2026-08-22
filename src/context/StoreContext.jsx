import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  initialCategories,
  initialProducts,
  initialReviews,
  initialCoupons,
  initialHomepageConfig,
  initialOrders,
  initialSEOConfig
} from '../data/initialData';
import { dbAPI, isSupabaseConfigured, supabase } from '../lib/supabase';

const StoreContext = createContext();

const normalizeProduct = (p) => p ? {
  ...p,
  originalPrice: p.original_price ?? p.originalPrice ?? null,
  isFeatured: p.is_featured ?? p.isFeatured ?? false,
  isBestSeller: p.is_bestseller ?? p.isBestSeller ?? false,
  isNewArrival: p.is_new ?? p.isNewArrival ?? false,
  inStock: p.in_stock ?? p.inStock ?? true,
  stock: p.stock_count ?? p.stock ?? 50,
  categoryId: p.category ?? p.categoryId ?? 'general',
  subcategoryId: p.subcategory ?? p.subcategoryId ?? null,
  discountPercentage: p.discount_percentage ?? p.discountPercentage ?? 0,
  isTrending: p.is_trending ?? p.isTrending ?? false,
  isSale: p.is_sale ?? p.isSale ?? false,
  reviewCount: p.review_count ?? p.reviewCount ?? 0,
  images: p.gallery ?? p.images ?? (p.image ? [p.image] : [])
} : p;

const normalizeCoupon = (c) => c ? {
  ...c,
  value: c.discount ?? c.value ?? 10,
  type: c.is_percentage ? 'percentage' : 'fixed',
  isPercentage: c.is_percentage ?? true,
  minSpend: c.min_spend ?? c.minSpend ?? 0,
  isActive: c.is_active ?? c.isActive ?? true
} : c;

const normalizeCategory = (c) => c ? {
  ...c,
  subcategories: c.subcategories || []
} : c;

const normalizeOrder = (o) => o ? {
  ...o,
  customerName: o.customer_name ?? o.customerName ?? 'Customer',
  customerEmail: o.customer_email ?? o.customerEmail ?? '',
  paymentMethod: o.payment_method ?? o.paymentMethod ?? 'Cash on Delivery (COD)',
  totalAmount: o.total ?? o.totalAmount ?? 0
} : o;

const normalizeReview = (r) => r ? {
  ...r,
  productId: r.product_id ?? r.productId ?? '',
  customerName: r.author ?? r.customerName ?? 'Customer'
} : r;

export const StoreProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [homepageConfig, setHomepageConfig] = useState({});
  const [orders, setOrders] = useState([]);
  const [seoConfig, setSeoConfig] = useState({});

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('taskeen_pkr_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('taskeen_pkr_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [productViewCounts, setProductViewCounts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('taskeen_pkr_viewCounts')) || {};
    } catch { return {}; }
  });

  const viewCountsTimeoutRef = useRef(null);
  useEffect(() => {
    if (viewCountsTimeoutRef.current) clearTimeout(viewCountsTimeoutRef.current);
    viewCountsTimeoutRef.current = setTimeout(() => {
      localStorage.setItem('taskeen_pkr_viewCounts', JSON.stringify(productViewCounts));
    }, 500);
    return () => clearTimeout(viewCountsTimeoutRef.current);
  }, [productViewCounts]);

  const trackProductView = useCallback((productId) => {
    setProductViewCounts(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  }, []);

  const defaultAdminUser = {
    id: "user-admin-maryam",
    name: "Maryam Admin",
    email: "maryam12mzzzz@gmail.com",
    role: "admin"
  };

  const [allUsers, setAllUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('taskeen_pkr_allUsers');
      return saved ? JSON.parse(saved) : [defaultAdminUser];
    } catch { return [defaultAdminUser]; }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('taskeen_pkr_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('taskeen_pkr_theme') || 'light';
    } catch { return 'light'; }
  });

  useEffect(() => {
    localStorage.setItem('taskeen_pkr_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const [currentView, _setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [shopFilter, setShopFilter] = useState('all'); // 'all', 'sale', 'new', 'bestseller', 'trending'

  // Wrap setCurrentView to push browser history so back button stays in app
  const setCurrentView = useCallback((view) => {
    _setCurrentView(prev => {
      if (prev === view) return prev;
      window.history.pushState({ view }, '', '');
      return view;
    });
  }, []);

  // Handle browser back/forward button
  useEffect(() => {
    // Push initial state so back from external site lands on home
    window.history.replaceState({ view: 'home' }, '', '');

    const handlePopState = (e) => {
      const view = e.state?.view || 'home';
      _setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [toastMessage, setToastMessage] = useState(null);

  const channelsRef = useRef([]);

  useEffect(() => {
    localStorage.setItem('taskeen_pkr_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('taskeen_pkr_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('taskeen_pkr_allUsers', JSON.stringify(allUsers));
  }, [allUsers]);

  // Subscribe to real-time changes
  const setupSubscriptions = useCallback(() => {
    if (!isSupabaseConfigured) return;

    const subs = [
      { table: 'categories', setter: setCategories, norm: normalizeCategory },
      { table: 'products', setter: setProducts, norm: normalizeProduct },
      { table: 'orders', setter: setOrders, norm: normalizeOrder },
      { table: 'reviews', setter: setReviews, norm: normalizeReview },
      { table: 'coupons', setter: setCoupons, norm: normalizeCoupon }
    ];

    subs.forEach(({ table, setter, norm }) => {
      const channel = supabase
        .channel(`${table}-live-${Date.now()}`)
        .on('postgres_changes',
          { event: '*', schema: 'public', table },
          (payload) => {
            setter(prev => {
              if (payload.eventType === 'INSERT') {
                const item = norm(payload.new);
                if (prev.some(p => p.id === item.id)) return prev;
                return [item, ...prev];
              }
              if (payload.eventType === 'UPDATE') {
                const item = norm(payload.new);
                return prev.map(p => p.id === item.id ? { ...p, ...item } : p);
              }
              if (payload.eventType === 'DELETE') {
                return prev.filter(p => p.id !== payload.old.id);
              }
              return prev;
            });
          }
        )
        .subscribe();

      channelsRef.current.push(channel);
    });

    const homeChan = supabase
      .channel('homepage_config-live')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'homepage_config' },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new && payload.new.config) {
            setHomepageConfig(payload.new.config);
          } else if (payload.eventType === 'INSERT' && payload.new && payload.new.config) {
            setHomepageConfig(payload.new.config);
          }
        }
      )
      .subscribe();
    channelsRef.current.push(homeChan);
  }, []);

  // Initial data fetch from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCategories(initialCategories.map(normalizeCategory));
      setProducts(initialProducts.map(normalizeProduct));
      setReviews(initialReviews.map(normalizeReview));
      setCoupons(initialCoupons.map(normalizeCoupon));
      setHomepageConfig(initialHomepageConfig);
      setOrders(initialOrders.map(normalizeOrder));
      setSeoConfig(initialSEOConfig);
      setIsLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const [
          dbProducts, dbCategories, dbOrders, dbReviews, dbCoupons,
          dbHomepage, dbSEO, dbUsers
        ] = await Promise.all([
          dbAPI.getProducts(),
          dbAPI.getCategories(),
          dbAPI.getOrders(),
          dbAPI.getReviews(),
          dbAPI.getCoupons(),
          dbAPI.getHomepageConfig(),
          dbAPI.getSEOConfig(),
          dbAPI.getUsers()
        ]);

        if (dbProducts && dbProducts.length > 0) setProducts(dbProducts.map(normalizeProduct));
        else setProducts(initialProducts.map(normalizeProduct));
        if (dbCategories && dbCategories.length > 0) setCategories(dbCategories.map(normalizeCategory));
        else setCategories(initialCategories.map(normalizeCategory));
        if (dbOrders && dbOrders.length > 0) setOrders(dbOrders.map(normalizeOrder));
        else setOrders(initialOrders.map(normalizeOrder));
        if (dbReviews && dbReviews.length > 0) setReviews(dbReviews.map(normalizeReview));
        else setReviews(initialReviews.map(normalizeReview));
        if (dbCoupons && dbCoupons.length > 0) setCoupons(dbCoupons.map(normalizeCoupon));
        else setCoupons(initialCoupons.map(normalizeCoupon));
        if (dbHomepage && dbHomepage.config) setHomepageConfig(dbHomepage.config);
        else setHomepageConfig(initialHomepageConfig);
        if (dbSEO && dbSEO.config) setSeoConfig(dbSEO.config);
        else setSeoConfig(initialSEOConfig);
        if (dbUsers && dbUsers.length > 0) {
          setAllUsers(dbUsers);
          const adminUser = dbUsers.find(u => u.email?.toLowerCase() === 'maryam12mzzzz@gmail.com');
          if (!adminUser) {
            setAllUsers(prev => {
              const exists = prev.some(u => u.email?.toLowerCase() === 'maryam12mzzzz@gmail.com');
              return exists ? prev : [defaultAdminUser, ...prev];
            });
          }
        }
      } catch {
        setCategories(initialCategories.map(normalizeCategory));
        setProducts(initialProducts.map(normalizeProduct));
        setReviews(initialReviews.map(normalizeReview));
        setCoupons(initialCoupons.map(normalizeCoupon));
        setHomepageConfig(initialHomepageConfig);
        setOrders(initialOrders.map(normalizeOrder));
        setSeoConfig(initialSEOConfig);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
    setupSubscriptions();

    return () => {
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [setupSubscriptions]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auth Operations
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const existingDbUser = await dbAPI.getUser(cleanEmail);
    const existingLocalUser = allUsers.find(u => u.email?.toLowerCase() === cleanEmail);
    const targetUser = existingDbUser || existingLocalUser;

    let loggedUser;
    let assignedRole = targetUser?.role || 'customer';
    if (cleanEmail === 'maryam12mzzzz@gmail.com') {
      assignedRole = 'admin';
    }

    if (targetUser) {
      loggedUser = {
        id: targetUser.id || `user-${Date.now()}`,
        name: targetUser.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: targetUser.phone || '',
        role: assignedRole
      };
    } else {
      loggedUser = {
        id: `user-${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '',
        role: assignedRole
      };
    }

    setUser(loggedUser);
    localStorage.setItem('taskeen_pkr_user', JSON.stringify(loggedUser));
    setAllUsers(prev => {
      const filtered = prev.filter(u => u.email?.toLowerCase() !== cleanEmail);
      return [...filtered, loggedUser];
    });

    const isUserAdmin = loggedUser.role === 'admin';
    showToast(isUserAdmin ? "Signed in as Store Administrator" : `Welcome back, ${loggedUser.name}!`);
    setIsAuthModalOpen(false);
    dbAPI.saveUser(loggedUser);
    return { success: true, role: loggedUser.role };
  };

  const register = async (name, phone, email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const existingDbUser = await dbAPI.getUser(cleanEmail);

    const newUser = {
      id: existingDbUser?.id || `user-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: cleanEmail,
      role: existingDbUser?.role || 'customer'
    };

    setUser(newUser);
    localStorage.setItem('taskeen_pkr_user', JSON.stringify(newUser));
    setAllUsers(prev => [...prev.filter(u => u.email?.toLowerCase() !== cleanEmail), newUser]);
    showToast(`Account created! Welcome, ${newUser.name}!`);
    setIsAuthModalOpen(false);
    dbAPI.saveUser(newUser);
    return { success: true, user: newUser };
  };

  const updateUserRole = async (userId, newRole) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (user && user.id === userId) {
      setUser(prev => ({ ...prev, role: newRole }));
    }
    await dbAPI.updateUserRole(userId, newRole);
    showToast(`User role updated to ${newRole}`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskeen_pkr_user');
    showToast("Signed out successfully");
    if (currentView === 'admin') {
      setCurrentView('home');
    }
  };

  // Cart Operations
  const addToCart = (product, color = null, size = null, quantity = 1) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      brand: product.brand || '',
      images: product.images || (product.image ? [product.image] : []),
      selectedColor: color || product.colors?.[0] || 'Standard',
      selectedSize: size || product.sizes?.[0] || 'Standard',
      quantity
    };
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && item.selectedColor === cartItem.selectedColor && item.selectedSize === cartItem.selectedSize
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity };
        return updated;
      }
      return [...prev, cartItem];
    });
    showToast(`Added "${product.name}" to Cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    showToast("Item removed from cart");
  };

  const updateCartQty = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) return prev.filter((_, i) => i !== index);
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = (code) => {
    const coupon = coupons.find(c => c.code?.toUpperCase() === code.trim().toUpperCase() && c.isActive !== false);
    if (!coupon) {
      showToast("Invalid or expired coupon code", "error");
      return false;
    }
    const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartSubtotal < (coupon.minSpend || 0)) {
      showToast(`Coupon requires minimum order of Rs. ${(coupon.minSpend || 0).toLocaleString()}`, "error");
      return false;
    }
    setAppliedCoupon(coupon);
    showToast(`Coupon "${coupon.code}" applied successfully!`);
    return true;
  };

  // Wishlist
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      showToast(exists ? `Removed "${product.name}" from wishlist` : `Added "${product.name}" to wishlist`);
      return exists ? prev.filter(p => p.id !== product.id) : [...prev, product];
    });
  };

  const isInWishlist = (productId) => wishlist.some(p => p.id === productId);

  // Order Operations
  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      items: [...cart],
      ...orderDetails
    };
    setOrders(prev => [newOrder, ...prev]);
    dbAPI.createOrder(newOrder);
    clearCart();
    return newOrder;
  };

  // ADMIN CRUD - always write to DB first, then update local state
  const addProduct = async (newProd) => {
    const created = {
      ...newProd,
      id: `prod-${Date.now()}`,
      slug: newProd.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `prod-${Date.now()}`,
      rating: newProd.rating || 5.0,
      reviewCount: 0
    };
    setProducts(prev => [created, ...prev]);
    await dbAPI.saveProduct(created);
    showToast(`Product "${created.name}" added!`);
  };

  const editProduct = async (id, updatedFields) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    const updated = { ...target, ...updatedFields };
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    await dbAPI.saveProduct(updated);
    showToast("Product updated successfully!");
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    dbAPI.deleteProduct(id);
    showToast("Product deleted");
  };

  const duplicateProduct = async (id) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    const duplicated = {
      ...target,
      id: `prod-${Date.now()}`,
      name: `${target.name} (Copy)`,
      slug: `${target.slug}-copy`
    };
    setProducts(prev => [duplicated, ...prev]);
    await dbAPI.saveProduct(duplicated);
    showToast("Product duplicated");
  };

  const addCategory = async (name, parentId = null, image = '') => {
    const newCatId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (parentId) {
      const parentCat = categories.find(c => c.id === parentId);
      if (parentCat) {
        const sub = parentCat.subcategories || [];
        const updatedParent = {
          ...parentCat,
          subcategories: [...sub, { id: `${parentId}-${newCatId}`, name, slug: newCatId }]
        };
        setCategories(prev => prev.map(c => c.id === parentId ? updatedParent : c));
        await dbAPI.saveCategory(updatedParent);
      }
    } else {
      const newCat = {
        id: newCatId,
        name,
        slug: newCatId,
        image: image || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
        description: `All ${name} items`,
        subcategories: []
      };
      setCategories(prev => [newCat, ...prev]);
      await dbAPI.saveCategory(newCat);
    }
    showToast(`Category "${name}" created!`);
  };

  const updateCategory = async (id, updatedFields) => {
    const target = categories.find(c => c.id === id);
    if (!target) return;
    const updated = { ...target, ...updatedFields };
    setCategories(prev => prev.map(c => c.id === id ? updated : c));
    await dbAPI.saveCategory(updated);
    showToast("Category updated successfully!");
  };

  const deleteCategory = (catId, subCatId = null) => {
    if (subCatId) {
      const parentCat = categories.find(c => c.id === catId);
      if (parentCat) {
        const updated = {
          ...parentCat,
          subcategories: (parentCat.subcategories || []).filter(sub => sub.id !== subCatId)
        };
        dbAPI.saveCategory(updated);
        setCategories(prev => prev.map(c => c.id === catId ? updated : c));
      }
    } else {
      setCategories(prev => prev.filter(c => c.id !== catId));
      dbAPI.deleteCategory(catId);
    }
    showToast("Category removed");
  };

  const addSubcategory = async (categoryId, name) => {
    const parentCat = categories.find(c => c.id === categoryId);
    if (!parentCat || !name.trim()) return;
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newSub = {
      id: `${categoryId}-${slug}-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      slug
    };
    const updated = {
      ...parentCat,
      subcategories: [...(parentCat.subcategories || []), newSub]
    };
    setCategories(prev => prev.map(c => c.id === categoryId ? updated : c));
    await dbAPI.saveCategory(updated);
    showToast(`Subcategory "${name.trim()}" added under ${parentCat.name}!`);
  };

  const deleteSubcategory = async (categoryId, subCatId) => {
    const parentCat = categories.find(c => c.id === categoryId);
    if (!parentCat) return;
    const updated = {
      ...parentCat,
      subcategories: (parentCat.subcategories || []).filter(sub => sub.id !== subCatId)
    };
    setCategories(prev => prev.map(c => c.id === categoryId ? updated : c));
    await dbAPI.saveCategory(updated);
    // Detach any products still assigned to the deleted subcategory
    const orphaned = products.filter(p => (p.subcategoryId || p.subcategory) === subCatId);
    orphaned.forEach(p => dbAPI.saveProduct({ ...p, subcategoryId: null, subcategory: null }));
    setProducts(prev => prev.map(p => (p.subcategoryId || p.subcategory) === subCatId ? { ...p, subcategoryId: null, subcategory: null } : p));
    showToast("Subcategory removed");
  };

  const updateHomepageConfig = async (newConfig) => {
    const merged = { ...homepageConfig, ...newConfig };
    setHomepageConfig(merged);
    await dbAPI.saveHomepageConfig(merged);
    showToast("Homepage settings saved!");
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    dbAPI.updateOrderStatus(orderId, newStatus);
    showToast(`Order ${orderId} marked as ${newStatus}`);
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    dbAPI.deleteOrder(orderId);
    showToast(`Order ${orderId} deleted`);
  };

  const addCoupon = async (coupon) => {
    setCoupons(prev => [coupon, ...prev]);
    await dbAPI.saveCoupon(coupon);
    showToast(`Coupon "${coupon.code}" added`);
  };

  const deleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    dbAPI.deleteCoupon(id);
    showToast("Coupon removed");
  };

  const updateSEOConfig = async (newSeo) => {
    const merged = { ...seoConfig, ...newSeo };
    setSeoConfig(merged);
    await dbAPI.saveSEOConfig(merged);
    showToast("SEO settings updated!");
  };

  return (
    <StoreContext.Provider value={{
      categories,
      products,
      reviews,
      coupons,
      theme,
      homepageConfig,
      orders,
      seoConfig,
      cart,
      wishlist,
      appliedCoupon,
      user,
      allUsers,
      isAdmin,
      currentView,
      selectedCategory,
      shopFilter,
      searchQuery,
      isCartOpen,
      isMobileDrawerOpen,
      isSearchModalOpen,
      isAuthModalOpen,
      selectedProductModal,
      activeAdminTab,
      toastMessage,
      isLoading,

      setCurrentView,
      setSelectedCategory,
      setShopFilter,
      setSearchQuery,
      setIsCartOpen,
      setIsMobileDrawerOpen,
      setIsSearchModalOpen,
      setIsAuthModalOpen,
      setSelectedProductModal,
      setActiveAdminTab,
      showToast,
      toggleTheme,
      productViewCounts,
      trackProductView,

      login,
      register,
      logout,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      applyCouponCode,
      toggleWishlist,
      isInWishlist,
      placeOrder,

      addProduct,
      editProduct,
      deleteProduct,
      duplicateProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addSubcategory,
      deleteSubcategory,
      updateHomepageConfig,
      updateOrderStatus,
      deleteOrder,
      addCoupon,
      deleteCoupon,
      updateSEOConfig,
      updateUserRole
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
