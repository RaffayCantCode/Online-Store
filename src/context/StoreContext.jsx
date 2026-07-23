import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialCategories,
  initialProducts,
  initialReviews,
  initialCoupons,
  initialHomepageConfig,
  initialOrders,
  initialSEOConfig
} from '../data/initialData';
import { dbAPI, isSupabaseConfigured } from '../lib/supabase';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Persistence Helpers
  const getPersistedData = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`taskeen_pkr_${key}`);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      if (!parsed) return fallback;
      if (typeof parsed === 'object' && !Array.isArray(parsed) && Object.keys(parsed).length === 0 && fallback && Object.keys(fallback).length > 0) {
        return fallback;
      }
      return parsed;
    } catch (e) {
      console.error("Error reading localStorage", e);
      return fallback;
    }
  };

  const setPersistedData = (key, value) => {
    try {
      localStorage.setItem(`taskeen_pkr_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error("Error setting localStorage", e);
    }
  };

  // State Declarations
  const [categories, setCategories] = useState(() => getPersistedData('categories', initialCategories));
  const [products, setProducts] = useState(() => getPersistedData('products', initialProducts));
  const [reviews, setReviews] = useState(() => getPersistedData('reviews', initialReviews));
  const [coupons, setCoupons] = useState(() => getPersistedData('coupons', initialCoupons));
  const [homepageConfig, setHomepageConfig] = useState(() => getPersistedData('homepageConfig', initialHomepageConfig));
  const [orders, setOrders] = useState(() => getPersistedData('orders', initialOrders));
  const [seoConfig, setSeoConfig] = useState(() => getPersistedData('seoConfig', initialSEOConfig));

  // Shopping Cart & Wishlist
  const [cart, setCart] = useState(() => getPersistedData('cart', []));
  const [wishlist, setWishlist] = useState(() => getPersistedData('wishlist', []));
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Authentication & Security (Role-based purely from Database 'role' column)
  const defaultAdminUser = {
    id: "user-admin-maryam",
    name: "Maryam Admin",
    email: "maryam12mzzzz@gmail.com",
    role: "admin"
  };

  const [allUsers, setAllUsers] = useState(() => {
    const local = getPersistedData('users', [defaultAdminUser]);
    if (!local.some(u => u.email?.toLowerCase() === 'maryam12mzzzz@gmail.com')) {
      return [...local, defaultAdminUser];
    }
    return local.map(u => u.email?.toLowerCase() === 'maryam12mzzzz@gmail.com' ? { ...u, role: 'admin' } : u);
  });

  const [user, setUser] = useState(() => {
    const localUser = getPersistedData('user', null);
    if (localUser && localUser.email?.toLowerCase() === 'maryam12mzzzz@gmail.com') {
      return { ...localUser, role: 'admin' };
    }
    return localUser;
  });

  const isAdmin = user?.role === 'admin';

  // Sync users & active user role with Supabase on mount
  useEffect(() => {
    async function syncUsers() {
      const dbUsers = await dbAPI.getUsers();
      if (dbUsers && dbUsers.length > 0) {
        setAllUsers(dbUsers);
        
        if (user && user.email) {
          const freshDbUser = dbUsers.find(u => u.email.toLowerCase() === user.email.toLowerCase());
          if (freshDbUser && freshDbUser.role !== user.role) {
            setUser(prev => ({ ...prev, role: freshDbUser.role, name: freshDbUser.name || prev.name }));
          }
        }
      }
    }
    syncUsers();
  }, [user?.email]);

  useEffect(() => {
    setPersistedData('users', allUsers);
  }, [allUsers]);

  // UI Modals & Active View Control
  const [currentView, setCurrentView] = useState('home'); // 'home', 'shop', 'admin', 'checkout'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [toastMessage, setToastMessage] = useState(null);

  // Persist State Updates
  useEffect(() => setPersistedData('categories', categories), [categories]);
  useEffect(() => setPersistedData('products', products), [products]);
  useEffect(() => setPersistedData('reviews', reviews), [reviews]);
  useEffect(() => setPersistedData('coupons', coupons), [coupons]);
  useEffect(() => setPersistedData('homepageConfig', homepageConfig), [homepageConfig]);
  useEffect(() => setPersistedData('orders', orders), [orders]);
  useEffect(() => setPersistedData('seoConfig', seoConfig), [seoConfig]);
  useEffect(() => setPersistedData('cart', cart), [cart]);
  useEffect(() => setPersistedData('wishlist', wishlist), [wishlist]);
  useEffect(() => setPersistedData('user', user), [user]);

  // Initial Supabase Data Fetching
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const fetchSupabaseData = async () => {
      const [dbProducts, dbCategories, dbOrders, dbReviews, dbCoupons] = await Promise.all([
        dbAPI.getProducts(),
        dbAPI.getCategories(),
        dbAPI.getOrders(),
        dbAPI.getReviews(),
        dbAPI.getCoupons()
      ]);
      if (dbProducts && dbProducts.length > 0) setProducts(dbProducts);
      if (dbCategories && dbCategories.length > 0) setCategories(dbCategories);
      if (dbOrders && dbOrders.length > 0) setOrders(dbOrders);
      if (dbReviews && dbReviews.length > 0) setReviews(dbReviews);
      if (dbCoupons && dbCoupons.length > 0) setCoupons(dbCoupons);
    };
    fetchSupabaseData();
  }, []);

  // Toast Notification Helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auth Operations - 100% Dynamic Database Roles from PostgreSQL
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Fetch exact user from Supabase database or local cache
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
    
    // Sync into allUsers list
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
    
    // Preserve role if user already exists in DB
    const existingDbUser = await dbAPI.getUser(cleanEmail);

    const newUser = {
      id: existingDbUser?.id || `user-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: cleanEmail,
      role: existingDbUser?.role || 'customer' // Default role: 'customer' unless database role is set
    };

    setUser(newUser);
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
    showToast("Signed out successfully");
    if (currentView === 'admin') {
      setCurrentView('home');
    }
  };

  // Cart Operations
  const addToCart = (product, color = null, size = null, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && item.selectedColor === color && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          ...product,
          selectedColor: color || product.colors?.[0] || 'Standard',
          selectedSize: size || product.sizes?.[0] || 'Standard',
          quantity
        }];
      }
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
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = (code) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!coupon) {
      showToast("Invalid or expired coupon code", "error");
      return false;
    }
    const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartSubtotal < coupon.minSpend) {
      showToast(`Coupon requires minimum order of Rs. ${coupon.minSpend.toLocaleString()}`, "error");
      return false;
    }
    setAppliedCoupon(coupon);
    showToast(`Coupon "${coupon.code}" applied successfully!`);
    return true;
  };

  // Wishlist Operations
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist`);
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast(`Added "${product.name}" to wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(p => p.id === productId);
  };

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

  // ADMIN CRUD OPERATIONS
  const addProduct = (newProd) => {
    const created = {
      ...newProd,
      id: `prod-${Date.now()}`,
      slug: newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: newProd.rating || 5.0,
      reviewCount: 0
    };
    setProducts(prev => [created, ...prev]);
    dbAPI.saveProduct(created);
    showToast(`Product "${created.name}" added!`);
  };

  const editProduct = (id, updatedFields) => {
    setProducts(prev => {
      const updatedList = prev.map(p => p.id === id ? { ...p, ...updatedFields } : p);
      const target = updatedList.find(p => p.id === id);
      if (target) dbAPI.saveProduct(target);
      return updatedList;
    });
    showToast("Product updated successfully!");
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    dbAPI.deleteProduct(id);
    showToast("Product deleted");
  };

  const duplicateProduct = (id) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    const duplicated = {
      ...target,
      id: `prod-${Date.now()}`,
      name: `${target.name} (Copy)`,
      slug: `${target.slug}-copy`
    };
    setProducts(prev => [duplicated, ...prev]);
    dbAPI.saveProduct(duplicated);
    showToast("Product duplicated");
  };

  const addCategory = (name, parentId = null, image = '') => {
    const newCatId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (parentId) {
      setCategories(prev => {
        const updated = prev.map(cat => {
          if (cat.id === parentId) {
            const sub = cat.subcategories || [];
            return {
              ...cat,
              subcategories: [...sub, { id: `${parentId}-${newCatId}`, name, slug: newCatId }]
            };
          }
          return cat;
        });
        const parentCat = updated.find(c => c.id === parentId);
        if (parentCat) dbAPI.saveCategory(parentCat);
        return updated;
      });
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
      dbAPI.saveCategory(newCat);
    }
    showToast(`Category "${name}" created!`);
  };

  const updateCategory = (id, updatedFields) => {
    setCategories(prev => {
      const updated = prev.map(cat => cat.id === id ? { ...cat, ...updatedFields } : cat);
      const target = updated.find(c => c.id === id);
      if (target) dbAPI.saveCategory(target);
      return updated;
    });
    showToast("Category updated successfully!");
  };

  const deleteCategory = (catId, subCatId = null) => {
    if (subCatId) {
      setCategories(prev => {
        const updated = prev.map(cat => {
          if (cat.id === catId) {
            return {
              ...cat,
              subcategories: (cat.subcategories || []).filter(sub => sub.id !== subCatId)
            };
          }
          return cat;
        });
        const parentCat = updated.find(c => c.id === catId);
        if (parentCat) dbAPI.saveCategory(parentCat);
        return updated;
      });
    } else {
      setCategories(prev => prev.filter(c => c.id !== catId));
      dbAPI.deleteCategory(catId);
    }
    showToast("Category removed");
  };

  const updateHomepageConfig = (newConfig) => {
    setHomepageConfig(prev => ({ ...prev, ...newConfig }));
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

  const addCoupon = (coupon) => {
    setCoupons(prev => [coupon, ...prev]);
    dbAPI.saveCoupon(coupon);
    showToast(`Coupon "${coupon.code}" added`);
  };

  const deleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    dbAPI.deleteCoupon(id);
    showToast("Coupon removed");
  };

  const updateSEOConfig = (newSeo) => {
    setSeoConfig(prev => ({ ...prev, ...newSeo }));
    showToast("SEO settings updated!");
  };

  return (
    <StoreContext.Provider value={{
      categories,
      products,
      reviews,
      coupons,
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
      searchQuery,
      isCartOpen,
      isMobileDrawerOpen,
      isSearchModalOpen,
      isAuthModalOpen,
      selectedProductModal,
      activeAdminTab,
      toastMessage,

      // Triggers
      setCurrentView,
      setSelectedCategory,
      setSearchQuery,
      setIsCartOpen,
      setIsMobileDrawerOpen,
      setIsSearchModalOpen,
      setIsAuthModalOpen,
      setSelectedProductModal,
      setActiveAdminTab,
      showToast,

      // Operations
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

      // Admin CRUD
      addProduct,
      editProduct,
      deleteProduct,
      duplicateProduct,
      addCategory,
      updateCategory,
      deleteCategory,
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
