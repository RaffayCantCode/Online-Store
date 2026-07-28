import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminGuard } from './AdminGuard';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Image as ImageIcon, 
  ShoppingBag, 
  Users, 
  Percent, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  ExternalLink,
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Tag,
  Save,
  UploadCloud,
  Zap,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

// Dual Image Input Component: Supports File Upload from device OR Image URL Input with Live Preview
const ImageUploaderInput = ({ label, value, onChange, placeholder = "https://images.unsplash.com/..." }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-gray-800 font-black text-xs">{label}</label>
      
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
        {/* Device File Upload Button */}
        <label className="cursor-pointer bg-brand-black hover:bg-gray-900 text-brand-orange text-xs font-black px-4 py-2.5 rounded-xl border border-brand-orange shadow-xs flex items-center justify-center space-x-2 shrink-0 transition active:scale-95">
          <UploadCloud className="w-4 h-4 text-brand-orange" />
          <span>Upload Image File</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </label>

        <span className="text-gray-400 text-[10px] font-black text-center sm:text-left uppercase">OR</span>

        {/* Image URL Text Input */}
        <input 
          type="text" 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-orange text-xs font-bold"
        />
      </div>

      {/* Live Preview Thumbnail */}
      {value && (
        <div className="mt-2.5 relative rounded-2xl overflow-hidden border-2 border-gray-300 bg-gray-100 max-h-36 w-auto inline-block shadow-xs">
          <img src={value} alt="Preview" className="h-28 w-auto object-cover" />
          <span className="absolute bottom-1.5 left-1.5 bg-brand-black/85 text-white px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
            Live Preview
          </span>
        </div>
      )}
    </div>
  );
};

export const AdminDashboard = () => {
  const { 
    products, 
    categories, 
    orders, 
    homepageConfig, 
    coupons, 
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
    allUsers,
    updateUserRole,
    setCurrentView,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState('overview');

  // Order Details Modal State
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Orders Pagination & Filter State
  const [ordersSearchQuery, setOrdersSearchQuery] = useState('');
  const [ordersStatusFilter, setOrdersStatusFilter] = useState('all');
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
  const ordersPerPage = 8;

  // Category Edit / Cover State
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({ name: '', image: '', description: '' });

  // Product Search & Filter State
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Product Discount Manager State
  const [discountSearchQuery, setDiscountSearchQuery] = useState('');
  const [discountCategoryFilter, setDiscountCategoryFilter] = useState('all');
  const [customDiscountPctMap, setCustomDiscountPctMap] = useState({});

  // Product Add / Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProdForm, setNewProdForm] = useState({
    name: '',
    categoryId: categories[0]?.id || 'beauty',
    price: 2500,
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'],
    description: 'High quality authentic product crafted for perfection.',
    inStock: true,
    stock: 1
  });

  // Real-Time Homepage Editor Form State
  const [announcementInput, setAnnouncementInput] = useState(
    homepageConfig?.announcementText || "⚡ Free Delivery Across Pakistan on Orders Over Rs. 3,000 | Cash on Delivery (COD) Available!"
  );
  
  const [heroForm, setHeroForm] = useState(
    homepageConfig?.hero || {
      badgeText: "SPECIAL DISCOUNT 2026",
      title: "Quality Products, Easy Online Shopping",
      subtitle: "Shop authentic cosmetics, skincare serums, hoodies, and accessories. Fast delivery across Pakistan with Cash on Delivery.",
      buttonText: "Shop All Catalog",
      secondaryButtonText: "View Offers",
      bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
    }
  );

  const [promoForm, setPromoForm] = useState(
    homepageConfig?.promoBanners || [
      {
        id: "promo-1",
        badge: "FLASH SALE",
        title: "Up to 35% OFF Makeup & Skincare",
        subtitle: "Authentic serums, liquid lipsticks & brush sets on sale.",
        buttonText: "Shop Sale Now",
        bgGradient: "from-orange-600 via-orange-500 to-amber-500",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"
      },
      {
        id: "promo-2",
        badge: "NEW ARRIVALS",
        title: "Fashion & Watches Collection",
        subtitle: "Minimalist watches, backpacks, and cotton fleece hoodies.",
        buttonText: "Explore Collection",
        bgGradient: "from-gray-900 via-gray-800 to-gray-900",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
      }
    ]
  );

  // Discount Form State
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    minSpend: 2000
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const soldOutCount = products.filter(p => p.inStock === false || (p.stock ?? p.stock_count ?? 0) <= 0).length;

  // Filtered Products List for Admin Table
  const filteredProducts = products.filter(p => {
    const nameMatch = (p.name || '').toLowerCase().includes(productSearchQuery.toLowerCase());
    const catMatch = productCategoryFilter === 'all' || p.categoryId === productCategoryFilter || p.category === productCategoryFilter;
    return nameMatch && catMatch;
  });

  // Filtered Products List for Product Discount Manager
  const filteredDiscountProducts = products.filter(p => {
    const nameMatch = (p.name || '').toLowerCase().includes(discountSearchQuery.toLowerCase());
    const catMatch = discountCategoryFilter === 'all' || p.categoryId === discountCategoryFilter || p.category === discountCategoryFilter;
    return nameMatch && catMatch;
  });

  // Filtered Orders List & Pagination
  const filteredOrders = orders.filter(o => {
    const q = ordersSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (o.id || '').toLowerCase().includes(q) || 
      (o.customerName || '').toLowerCase().includes(q) || 
      (o.phone || '').includes(q) || 
      (o.city || '').toLowerCase().includes(q);
    const matchesStatus = ordersStatusFilter === 'all' || o.status === ordersStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const paginatedOrders = filteredOrders.slice((ordersCurrentPage - 1) * ordersPerPage, ordersCurrentPage * ordersPerPage);

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (editingProduct) {
      editProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
    } else {
      addProduct(newProdForm);
      setIsAddProductModalOpen(false);
      setNewProdForm({
        name: '',
        categoryId: categories[0]?.id || 'beauty',
        price: 2500,
        images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'],
        description: 'High quality authentic product.',
        inStock: true,
        stock: 1
      });
    }
  };

  const handleSaveHomepageConfig = (e) => {
    e.preventDefault();
    updateHomepageConfig({
      announcementText: announcementInput,
      hero: heroForm,
      promoBanners: promoForm
    });
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    addCoupon({
      id: `c-${Date.now()}`,
      code: newCoupon.code.toUpperCase().trim(),
      type: newCoupon.type,
      value: Number(newCoupon.value),
      minSpend: Number(newCoupon.minSpend),
      description: `${newCoupon.value}${newCoupon.type === 'percentage' ? '%' : ' Rs.'} OFF on orders over Rs. ${newCoupon.minSpend}`,
      isActive: true
    });
    setNewCoupon({ code: '', type: 'percentage', value: 10, minSpend: 2000 });
  };

  // Helper function to apply percentage discount directly to a product
  const handleApplyProductDiscount = (prod, pct) => {
    const numericPct = Number(pct);
    if (isNaN(numericPct) || numericPct <= 0) {
      showToast("Please enter a valid discount percentage greater than 0", "error");
      return;
    }
    const basePrice = prod.price;
    const discountedPrice = Math.round(basePrice * (1 - numericPct / 100));

    editProduct(prod.id, {
      ...prod,
      originalPrice: basePrice,
      price: discountedPrice,
      discountPercentage: numericPct,
      isSale: true
    });

    showToast(`Applied ${numericPct}% OFF to "${prod.name}"! New price: Rs. ${discountedPrice.toLocaleString()}`);
  };

  // Helper function to remove discount and restore base price
  const handleRemoveProductDiscount = (prod) => {
    const basePrice = prod.originalPrice || prod.price;
    editProduct(prod.id, {
      ...prod,
      price: basePrice,
      originalPrice: null,
      discountPercentage: 0,
      isSale: false
    });
    setCustomDiscountPctMap(prev => {
      const updated = { ...prev };
      delete updated[prod.id];
      return updated;
    });
    showToast(`Restored original price Rs. ${basePrice.toLocaleString()} for "${prod.name}"`);
  };

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-brand-black text-white rounded-3xl p-6 sm:p-8 mb-8 border-2 border-brand-orange shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-brand-orange text-xs font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Taskeen Admin Control Panel PK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Store Manager Dashboard (Rupees PKR)
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-bold">
              Manage products, pricing, direct discounts, categories, customer orders, and real-time homepage content without editing code.
            </p>
          </div>

          <button 
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center space-x-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-black text-xs px-5 py-3 rounded-xl transition shadow-md self-start md:self-auto uppercase tracking-wider"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Preview Storefront</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
            { id: 'homepage', label: 'Homepage Editor', icon: ImageIcon },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'customers', label: `Users & Roles (${allUsers ? allUsers.length : 0})`, icon: Users },
            { id: 'discounts', label: `Discounts & Promos (${coupons.length})`, icon: Percent }
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition ${
                  activeTab === tab.id
                    ? 'bg-brand-black text-brand-orange border-2 border-brand-orange shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center font-black text-sm shrink-0 border border-green-200">
                  Rs.
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Sales Revenue</p>
                  <h3 className="text-2xl font-black text-gray-900 mt-0.5">Rs. {totalRevenue.toLocaleString()}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-brand-orange flex items-center justify-center font-bold shrink-0 border border-orange-200">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Orders</p>
                  <h3 className="text-2xl font-black text-gray-900 mt-0.5">{orders.length}</h3>
                  <p className="text-[10px] text-brand-orange font-extrabold">{pendingOrdersCount} Pending</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 border border-blue-200">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Products</p>
                  <h3 className="text-2xl font-black text-gray-900 mt-0.5">{products.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold shrink-0 border border-red-200">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Sold Out Products</p>
                  <h3 className="text-2xl font-black text-red-600 mt-0.5">{soldOutCount}</h3>
                </div>
              </div>
            </div>

            {/* Orders Summary */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-xs">
              <h3 className="text-base font-black text-gray-900 mb-4">Recent Customer Orders</h3>
              {orders.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 text-gray-500 text-xs font-bold">
                  No orders placed yet. Real customer orders placed on the website will appear here automatically.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-bold">
                    <thead className="bg-gray-50 text-gray-600 uppercase border-b-2 border-gray-200">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Payment Mode</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrderDetails(order)}>
                          <td className="p-3 font-mono font-black text-brand-orange">{order.id}</td>
                          <td className="p-3">{order.customerName}</td>
                          <td className="p-3 text-gray-500">{order.date || 'Recent'}</td>
                          <td className="p-3 text-brand-orange">Rs. {(order.totalAmount || order.total || 0).toLocaleString()}</td>
                          <td className="p-3 text-gray-600">{order.paymentMethod}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              order.status === 'Delivered' || order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedOrderDetails(order); }}
                              className="px-3 py-1 bg-brand-black text-brand-orange hover:bg-gray-900 text-[11px] font-bold rounded-lg border border-brand-orange"
                            >
                              View Order
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border-2 border-gray-200 shadow-xs">
              <div>
                <h3 className="text-base font-black text-gray-900">Products Catalog ({products.length})</h3>
                <p className="text-xs text-gray-500 font-bold mt-0.5">Search, filter by category, and manage product inventory & pricing.</p>
              </div>

              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddProductModalOpen(true);
                }}
                className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-black px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5 self-start md:self-auto uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Search & Category Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="Search products by title or code..."
                  className="w-full pl-10 pr-4 py-2 text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-orange focus:bg-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500 shrink-0" />
                <select 
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-extrabold text-gray-900 outline-none focus:border-brand-orange"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xs overflow-hidden">
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-xs font-bold">
                  No products found matching your search or category filter.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-bold">
                    <thead className="bg-gray-50 text-gray-600 uppercase border-b-2 border-gray-200">
                      <tr>
                        <th className="p-3">Product Image & Title</th>
                        <th className="p-3">Assigned Category</th>
                        <th className="p-3">Price (PKR)</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map(product => {
                        const catObj = categories.find(c => c.id === product.categoryId || c.id === product.category);
                        const prodImg = (product.images && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80';
                        return (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="p-3">
                              <div className="flex items-center space-x-3">
                                <img src={prodImg} alt={product.name} className="w-10 h-10 object-cover rounded-lg border border-gray-300 shrink-0" />
                                <p className="font-extrabold text-gray-900 line-clamp-1">{product.name}</p>
                              </div>
                            </td>
                            <td className="p-3 font-extrabold text-gray-700">{catObj ? catObj.name : (product.categoryId || product.category || 'General')}</td>
                            <td className="p-3 text-brand-orange font-black">Rs. {(product.price || 0).toLocaleString()}</td>
                            <td className="p-3">
                              <button
                                onClick={() => {
                                  const isAvailable = product.inStock !== false && (product.stock ?? product.stock_count ?? 0) > 0;
                                  editProduct(product.id, {
                                    ...product,
                                    inStock: !isAvailable,
                                    stock: !isAvailable ? 1 : 0,
                                    stock_count: !isAvailable ? 1 : 0
                                  });
                                }}
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black transition border-2 ${
                                  (product.inStock !== false && (product.stock ?? product.stock_count ?? 0) > 0)
                                    ? 'bg-green-100 text-green-800 border-green-400 hover:bg-red-100 hover:text-red-800 hover:border-red-400'
                                    : 'bg-red-100 text-red-800 border-red-400 hover:bg-green-100 hover:text-green-800 hover:border-green-400'
                                }`}
                                title="Click to toggle availability"
                              >
                                {(product.inStock !== false && (product.stock ?? product.stock_count ?? 0) > 0) ? 'Available' : 'Sold Out'}
                              </button>
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button onClick={() => setEditingProduct(product)} className="p-1 text-gray-600 hover:text-brand-orange" title="Edit Product">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => duplicateProduct(product.id)} className="p-1 text-gray-600 hover:text-blue-600" title="Duplicate">
                                <Copy className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteProduct(product.id)} className="p-1 text-gray-600 hover:text-red-600" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border-2 border-gray-200 shadow-xs">
              <div>
                <h3 className="text-base font-black text-gray-900">Categories & Page Covers ({categories.length})</h3>
                <p className="text-xs text-gray-500 font-bold mt-0.5">Manage store categories and cover banner images.</p>
              </div>
              <button 
                onClick={() => {
                  setNewCategoryData({ name: '', image: '', description: '' });
                  setIsAddCategoryModalOpen(true);
                }}
                className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-black px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5 uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="h-40 w-full relative bg-gray-200">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-white font-black text-sm drop-shadow-lg bg-black/50 px-2 py-0.5 rounded-lg">{cat.name}</span>
                    </div>

                    <div className="p-4 space-y-2 text-xs font-bold text-gray-700">
                      <p className="text-gray-500 text-[11px] line-clamp-2">{cat.description || 'No description'}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center space-x-2">
                    <button 
                      onClick={() => setEditingCategory(cat)}
                      className="flex-1 py-2 px-3 bg-white border border-gray-300 hover:border-brand-orange text-gray-900 text-xs font-black rounded-xl shadow-xs transition flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-3.5 h-3.5 text-brand-orange" />
                      <span>Edit Cover & Info</span>
                    </button>

                    <button 
                      onClick={() => deleteCategory(cat.id)}
                      className="p-2 text-gray-400 hover:text-red-600 bg-white border border-gray-300 rounded-xl transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HOMEPAGE EDITOR */}
        {activeTab === 'homepage' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-200 shadow-xs space-y-6">
              <div className="border-b-2 border-gray-100 pb-4">
                <h3 className="text-lg font-black text-gray-900">Real-Time Homepage & Banner Editor</h3>
                <p className="text-xs text-gray-500 font-bold mt-1">
                  Edit all texts, hero titles, promotional banners, and background images live. Changes publish instantly across your store.
                </p>
              </div>

              <form onSubmit={handleSaveHomepageConfig} className="space-y-8 text-xs font-bold">
                {/* 1. Header Announcement Bar */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                  <h4 className="text-xs font-black uppercase text-brand-orange tracking-wider">
                    1. Top Header Announcement Bar
                  </h4>
                  <div>
                    <label className="block mb-1 text-gray-800">Announcement Text</label>
                    <input 
                      type="text" 
                      required
                      value={announcementInput}
                      onChange={(e) => setAnnouncementInput(e.target.value)}
                      placeholder="e.g. ⚡ Free Shipping Across Pakistan on Orders Over Rs. 3,000!"
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-brand-orange text-xs font-bold"
                    />
                  </div>
                </div>

                {/* 2. Hero Section Settings */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="text-xs font-black uppercase text-brand-orange tracking-wider">
                    2. Main Hero Section (Top Banner)
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-gray-800">Hero Badge Text</label>
                      <input 
                        type="text" 
                        value={heroForm?.badgeText || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                        placeholder="SPECIAL DISCOUNT 2026"
                        className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-gray-800">Hero Main Title / Headline</label>
                      <input 
                        type="text" 
                        required
                        value={heroForm?.title || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                        placeholder="Quality Products, Easy Online Shopping"
                        className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-brand-orange font-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-800">Hero Subtitle Description</label>
                    <textarea 
                      rows={2}
                      value={heroForm?.subtitle || ''}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                      placeholder="Shop authentic cosmetics, skincare serums, hoodies..."
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-gray-800">Primary Button Label</label>
                      <input 
                        type="text" 
                        value={heroForm?.buttonText || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                        placeholder="Shop All Catalog"
                        className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-gray-800">Secondary Button Label</label>
                      <input 
                        type="text" 
                        value={heroForm?.secondaryButtonText || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonText: e.target.value })}
                        placeholder="View Offers"
                        className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  {/* Dual Image Input: Hero Background Image */}
                  <ImageUploaderInput 
                    label="Hero Background Banner Image (Upload File OR Paste URL)"
                    value={heroForm?.bgImage || ''}
                    onChange={(imgUrl) => setHeroForm({ ...heroForm, bgImage: imgUrl })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* 3. Promo Offer Banners */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-brand-orange tracking-wider">
                      3. Homepage Promo Offer Banners ({promoForm.length}/5)
                    </h4>
                    {promoForm.length < 5 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newCard = {
                            id: `promo-${Date.now()}`,
                            badge: "NEW OFFER",
                            title: "Special Promotion",
                            subtitle: "Great deals on selected items.",
                            buttonText: "Shop Now",
                            bgGradient: "from-orange-600 via-orange-500 to-amber-500",
                            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
                          };
                          setPromoForm(prev => [...prev, newCard]);
                        }}
                        className="flex items-center space-x-1 bg-brand-orange hover:bg-brand-orange-hover text-white text-[11px] font-black px-3 py-2 rounded-xl transition uppercase tracking-wider"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Card</span>
                      </button>
                    )}
                  </div>

                  {promoForm.map((promo, idx) => (
                    <div key={promo.id || idx} className="bg-white p-4 rounded-2xl border border-gray-300 space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="font-black text-gray-900 text-xs">Promo Card #{idx + 1}</span>
                        {promoForm.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setPromoForm(prev => prev.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition"
                            title="Remove card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-1 text-gray-700">Badge Text</label>
                          <input 
                            type="text" 
                            value={promo.badge}
                            onChange={(e) => {
                              const updated = [...promoForm];
                              updated[idx] = { ...updated[idx], badge: e.target.value };
                              setPromoForm(updated);
                            }}
                            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 text-gray-700">Promo Headline Title</label>
                          <input 
                            type="text" 
                            value={promo.title}
                            onChange={(e) => {
                              const updated = [...promoForm];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setPromoForm(updated);
                            }}
                            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-700 font-bold">Subtitle Description</label>
                        <input 
                          type="text" 
                          value={promo.subtitle}
                          onChange={(e) => {
                            const updated = [...promoForm];
                            updated[idx] = { ...updated[idx], subtitle: e.target.value };
                            setPromoForm(updated);
                          }}
                          className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-700 font-bold">Click Action / Target Catalog Filter</label>
                        <select
                          value={promo.filterType || 'sale'}
                          onChange={(e) => {
                            const updated = [...promoForm];
                            updated[idx] = { ...updated[idx], filterType: e.target.value };
                            setPromoForm(updated);
                          }}
                          className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-gray-900"
                        >
                          <option value="sale">🔥 Flash Sale & Discounted Products</option>
                          <option value="new">✨ New Arrivals</option>
                          <option value="bestseller">⭐ Best Sellers</option>
                          <option value="trending">🔥 Hot & Trending Items</option>
                          <option value="all">🛍️ All Catalog Products</option>
                          {categories.map(c => (
                            <option key={c.id} value={`cat:${c.id}`}>Category: {c.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Dual Image Input: Promo Card Image */}
                      <ImageUploaderInput 
                        label={`Promo Card #${idx + 1} Image (Upload File OR Paste URL)`}
                        value={promo.image}
                        onChange={(imgUrl) => {
                          const updated = [...promoForm];
                          updated[idx] = { ...updated[idx], image: imgUrl };
                          setPromoForm(updated);
                        }}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit"
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white font-black px-8 py-4 rounded-xl shadow-lg transition active:scale-98 text-xs uppercase tracking-wider flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Save & Publish Live Homepage</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: ORDERS WITH PAGINATION & DELETE/CROSS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900">All Customer Orders ({orders.length})</h3>
                  <p className="text-xs text-gray-500 font-bold">Search, filter by status, view details, or delete completed/processed orders.</p>
                </div>
              </div>

              {/* Search & Status Filter Toolbar */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input 
                    type="text" 
                    value={ordersSearchQuery}
                    onChange={(e) => { setOrdersSearchQuery(e.target.value); setOrdersCurrentPage(1); }}
                    placeholder="Search by Order ID, Customer, Phone, or City..."
                    className="w-full pl-10 pr-4 py-2 text-xs font-bold bg-white border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500 shrink-0" />
                  <select 
                    value={ordersStatusFilter}
                    onChange={(e) => { setOrdersStatusFilter(e.target.value); setOrdersCurrentPage(1); }}
                    className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-extrabold text-gray-900 outline-none focus:border-brand-orange"
                  >
                    <option value="all">All Order Statuses ({orders.length})</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 text-gray-500 text-xs font-bold">
                  No orders found matching your filter criteria.
                </div>
              ) : (
                <div className="overflow-x-auto border-2 border-gray-200 rounded-2xl">
                  <table className="w-full text-left text-xs font-bold">
                    <thead className="bg-gray-50 text-gray-600 uppercase border-b-2 border-gray-200">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer & Phone</th>
                        <th className="p-3">City & Address</th>
                        <th className="p-3">Payment Method</th>
                        <th className="p-3">Total Payable</th>
                        <th className="p-3">Order Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrderDetails(order)}>
                          <td className="p-3 font-mono font-black text-brand-orange">{order.id}</td>
                          <td className="p-3">
                            <span className="block font-extrabold text-gray-900">{order.customerName}</span>
                            <span className="text-[10px] text-gray-500 font-mono">{order.phone}</span>
                          </td>
                          <td className="p-3">
                            <span className="block font-bold text-gray-800">{order.city || 'Lahore'}</span>
                            <span className="text-[10px] text-gray-500 truncate max-w-[180px] block">{order.address}</span>
                          </td>
                          <td className="p-3 text-gray-700 font-extrabold">{order.paymentMethod}</td>
                          <td className="p-3 font-black text-brand-orange text-sm">Rs. {(order.totalAmount || order.total || 0).toLocaleString()}</td>
                          <td className="p-3">
                            <select 
                              value={order.status} 
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="bg-gray-50 border border-gray-300 rounded-lg p-1 text-xs font-extrabold text-gray-900 outline-none cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedOrderDetails(order); }}
                                className="px-3 py-1.5 bg-brand-orange text-white hover:bg-brand-orange-hover text-xs font-black rounded-xl shadow-xs uppercase tracking-wider"
                              >
                                View Order
                              </button>

                              {/* Cross / Delete Order Button */}
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  if (window.confirm(`Are you sure you want to delete order ${order.id}?`)) {
                                    deleteOrder(order.id);
                                  }
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 border border-gray-200 transition"
                                title="Delete / Cross Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Orders Pagination Controls */}
              {totalOrderPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs font-bold">
                  <span className="text-gray-500">
                    Showing Page <strong className="text-gray-900">{ordersCurrentPage}</strong> of <strong className="text-gray-900">{totalOrderPages}</strong> ({filteredOrders.length} total orders)
                  </span>

                  <div className="flex items-center space-x-2">
                    <button 
                      disabled={ordersCurrentPage === 1}
                      onClick={() => setOrdersCurrentPage(prev => Math.max(1, prev - 1))}
                      className="p-2 rounded-xl border border-gray-300 text-gray-700 disabled:opacity-40 hover:bg-gray-100 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {[...Array(totalOrderPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setOrdersCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-xl text-xs font-black transition ${
                          ordersCurrentPage === i + 1 
                            ? "bg-brand-orange text-white shadow-xs" 
                            : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button 
                      disabled={ordersCurrentPage === totalOrderPages}
                      onClick={() => setOrdersCurrentPage(prev => Math.min(totalOrderPages, prev + 1))}
                      className="p-2 rounded-xl border border-gray-300 text-gray-700 disabled:opacity-40 hover:bg-gray-100 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: USERS & ROLES */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-xs">
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4 mb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900">User Roles & Database Accounts ({allUsers ? allUsers.length : 0})</h3>
                  <p className="text-xs text-gray-500 font-bold">
                    View registered database users and grant or revoke Admin Dashboard access with 1 click.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bold">
                  <thead className="bg-gray-50 text-gray-600 uppercase border-b-2 border-gray-200">
                    <tr>
                      <th className="p-3">User Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Mobile Phone</th>
                      <th className="p-3">Current Role</th>
                      <th className="p-3 text-right">Change Role & Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allUsers && allUsers.map(usr => (
                      <tr key={usr.id || usr.email} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-brand-black text-brand-orange font-black flex items-center justify-center text-xs border border-brand-orange">
                              {usr.name ? usr.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="font-extrabold text-gray-900">{usr.name || 'Registered User'}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-700 font-mono">{usr.email}</td>
                        <td className="p-3 text-gray-500 font-mono">{usr.phone || '—'}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            usr.role === 'admin' 
                              ? 'bg-brand-black text-brand-orange border border-brand-orange shadow-xs' 
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {usr.role || 'customer'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <select 
                            value={usr.role || 'customer'} 
                            onChange={(e) => updateUserRole(usr.id, e.target.value)}
                            className="bg-white border-2 border-gray-300 hover:border-brand-orange rounded-xl px-3 py-1.5 text-xs font-extrabold text-gray-900 outline-none shadow-xs cursor-pointer"
                          >
                            <option value="customer">👤 Customer (Standard Access)</option>
                            <option value="admin">⚡ Admin (Full Dashboard Access)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: DISCOUNTS & PROMO CODES */}
        {activeTab === 'discounts' && (
          <div className="space-y-8 animate-fade-in">
            {/* SECTION 1: Direct Product Discount Manager */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-200 shadow-xs space-y-6">
              <div className="border-b-2 border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="inline-flex items-center space-x-1.5 text-brand-orange text-xs font-black uppercase tracking-wider mb-1">
                    <TrendingDown className="w-4 h-4" />
                    <span>Product Price Discount Manager</span>
                  </span>
                  <h3 className="text-lg font-black text-gray-900">Apply Direct % Discounts to Listed Products</h3>
                  <p className="text-xs text-gray-500 font-bold mt-0.5">
                    Select a product, choose a discount % or enter a custom value, then click Apply to set the sale price. Click Reset to restore the original price.
                  </p>
                </div>
              </div>

              {/* Product Search & Category Filter Toolbar */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input 
                    type="text" 
                    value={discountSearchQuery}
                    onChange={(e) => setDiscountSearchQuery(e.target.value)}
                    placeholder="Search product title to apply discount..."
                    className="w-full pl-10 pr-4 py-2 text-xs font-bold bg-white border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500 shrink-0" />
                  <select 
                    value={discountCategoryFilter}
                    onChange={(e) => setDiscountCategoryFilter(e.target.value)}
                    className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-extrabold text-gray-900 outline-none focus:border-brand-orange"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Discount Table */}
              <div className="border-2 border-gray-200 rounded-2xl overflow-hidden">
                {filteredDiscountProducts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-xs font-bold bg-gray-50">
                    No products found matching your search query.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold">
                      <thead className="bg-gray-100 text-gray-700 uppercase border-b-2 border-gray-200">
                        <tr>
                          <th className="p-3">Product</th>
                          <th className="p-3">Original Base Price</th>
                          <th className="p-3">Selling Price</th>
                          <th className="p-3">Discount Status</th>
                          <th className="p-3">Apply % Discount Preset</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredDiscountProducts.map(prod => {
                          const hasDiscount = (prod.discountPercentage || 0) > 0 || (prod.originalPrice && prod.originalPrice > prod.price);
                          const basePrice = prod.originalPrice || prod.price;
                          const selectedPct = customDiscountPctMap[prod.id] !== undefined ? customDiscountPctMap[prod.id] : (prod.discountPercentage || 0);
                          const prodImg = (prod.images && prod.images[0]) || prod.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80';

                          return (
                            <tr key={prod.id} className="hover:bg-gray-50">
                              <td className="p-3">
                                <div className="flex items-center space-x-3">
                                  <img src={prodImg} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-gray-300 shrink-0" />
                                  <div>
                                    <p className="font-extrabold text-gray-900 line-clamp-1">{prod.name}</p>
                                    <span className="text-[10px] text-gray-500 uppercase font-black">{prod.categoryId || 'General'}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3 text-gray-600 font-bold">
                                {hasDiscount ? (
                                  <span className="line-through text-gray-400">Rs. {basePrice.toLocaleString()}</span>
                                ) : (
                                  <span>Rs. {basePrice.toLocaleString()}</span>
                                )}
                              </td>

                              <td className="p-3 font-black text-brand-orange text-sm">
                                Rs. {prod.price.toLocaleString()}
                              </td>

                              <td className="p-3">
                                {hasDiscount ? (
                                  <span className="inline-block bg-brand-orange text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs whitespace-nowrap">
                                    {prod.discountPercentage}% OFF
                                  </span>
                                ) : (
                                  <span className="inline-block text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-gray-300 whitespace-nowrap">
                                    — No Discount
                                  </span>
                                )}
                              </td>

                              <td className="p-3">
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => setCustomDiscountPctMap(prev => ({ ...prev, [prod.id]: 0 }))}
                                    className={`px-2 py-1 text-[11px] font-black rounded-lg transition ${
                                      selectedPct == 0
                                        ? 'bg-gray-800 text-white border border-gray-800'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-300'
                                    }`}
                                  >
                                    None
                                  </button>
                                  {[10, 15, 20, 25, 30, 50].map(pctVal => (
                                    <button 
                                      key={pctVal}
                                      onClick={() => setCustomDiscountPctMap(prev => ({ ...prev, [prod.id]: pctVal }))}
                                      className={`px-2 py-1 text-[11px] font-black rounded-lg transition ${
                                        selectedPct == pctVal
                                          ? 'bg-brand-black text-brand-orange border border-brand-orange'
                                          : 'bg-gray-100 text-gray-700 hover:bg-brand-orange hover:text-white'
                                      }`}
                                    >
                                      {pctVal}%
                                    </button>
                                  ))}
                                </div>
                              </td>

                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <div className="flex items-center space-x-1">
                                    <input 
                                      type="number"
                                      min="1"
                                      max="90"
                                      value={selectedPct}
                                      onChange={(e) => setCustomDiscountPctMap({ ...customDiscountPctMap, [prod.id]: e.target.value })}
                                      className="w-14 p-1.5 text-xs font-black border border-gray-300 rounded-lg text-center outline-none focus:border-brand-orange"
                                      placeholder="%"
                                    />
                                    <button 
                                      onClick={() => handleApplyProductDiscount(prod, selectedPct)}
                                      className="px-3 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-black rounded-xl shadow-xs uppercase tracking-wider"
                                    >
                                      Apply
                                    </button>
                                  </div>

                                  {hasDiscount && (
                                    <button 
                                      onClick={() => handleRemoveProductDiscount(prod)}
                                      className="px-2.5 py-1.5 bg-gray-200 hover:bg-red-600 hover:text-white text-gray-700 text-xs font-bold rounded-xl transition"
                                      title="Remove Discount"
                                    >
                                      Reset
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: Checkout Promo Discount Codes */}
            <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-xs">
              <h3 className="text-base font-black text-gray-900 mb-4">Create New Promo Discount Code (For Cart Checkout)</h3>
              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-bold">
                <div>
                  <label className="block mb-1 text-gray-800">Promo Code (e.g. SALE20)</label>
                  <input 
                    type="text" 
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    placeholder="TASKEEN10"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-orange uppercase"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-800">Discount Type</label>
                  <select 
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                  >
                    <option value="percentage">Percentage OFF (%)</option>
                    <option value="fixed">Fixed Amount OFF (Rs. PKR)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-gray-800">Discount Value</label>
                  <input 
                    type="number" 
                    required
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-800">Min Spend (Rs.)</label>
                  <input 
                    type="number" 
                    required
                    value={newCoupon.minSpend}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minSpend: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="sm:col-span-4 flex justify-end">
                  <button 
                    type="submit"
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white font-black px-6 py-3 rounded-xl shadow uppercase text-xs tracking-wider"
                  >
                    Add Discount Code
                  </button>
                </div>
              </form>
            </div>

            {/* Active Discounts List */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xs overflow-hidden p-6">
              <h3 className="text-base font-black text-gray-900 mb-4">Active Promo Codes ({coupons.length})</h3>

              {coupons.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-xs font-bold bg-gray-50 rounded-2xl border border-gray-200">
                  No promo discount codes active yet. Use the form above to add discount codes for your store!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-bold">
                    <thead className="bg-gray-50 text-gray-600 uppercase border-b-2 border-gray-200">
                      <tr>
                        <th className="p-3">Discount Code</th>
                        <th className="p-3">Discount Value</th>
                        <th className="p-3">Min Order Spend</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {coupons.map(cp => (
                        <tr key={cp.id} className="hover:bg-gray-50">
                          <td className="p-3">
                            <span className="font-mono font-black text-brand-orange text-sm bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                              {cp.code}
                            </span>
                          </td>
                          <td className="p-3 font-black text-gray-900">
                            {cp.type === 'percentage' ? `${cp.value}% OFF` : `Rs. ${cp.value} FLAT OFF`}
                          </td>
                          <td className="p-3 text-gray-700">Rs. {cp.minSpend ? cp.minSpend.toLocaleString() : 0}</td>
                          <td className="p-3">
                            <span className="bg-green-100 text-green-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                              Active
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => deleteCoupon(cp.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition"
                              title="Delete Coupon"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: Product Add / Edit */}
        {(editingProduct || isAddProductModalOpen) && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/60" onClick={() => { setEditingProduct(null); setIsAddProductModalOpen(false); }} />
            <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-50 space-y-4 max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-fade-in">
              <h3 className="text-lg font-black text-gray-900">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product to Store'}
              </h3>
              
              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block mb-1 text-gray-800 font-black">Product Title / Name *</label>
                  <input 
                    type="text" 
                    required
                    value={editingProduct ? editingProduct.name : newProdForm.name}
                    onChange={e => editingProduct ? setEditingProduct({...editingProduct, name: e.target.value}) : setNewProdForm({...newProdForm, name: e.target.value})}
                    placeholder="e.g. Glowing Face Serum 30ml"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                  />
                </div>

                {/* Category Dropdown Selection */}
                <div>
                  <label className="block mb-1 text-gray-800 font-black">Assign to Specific Category *</label>
                  <select 
                    value={editingProduct ? (editingProduct.categoryId || editingProduct.category) : newProdForm.categoryId}
                    onChange={e => {
                      const val = e.target.value;
                      if (editingProduct) setEditingProduct({...editingProduct, categoryId: val, category: val});
                      else setNewProdForm({...newProdForm, categoryId: val});
                    }}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-orange font-bold text-gray-900"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Dual Image Input: Upload File OR Image URL */}
                <ImageUploaderInput 
                  label="Product Custom Image (Upload File OR Paste URL) *"
                  value={editingProduct ? (editingProduct.images?.[0] || editingProduct.image || '') : (newProdForm.images?.[0] || '')}
                  onChange={imgUrl => {
                    if (editingProduct) setEditingProduct({ ...editingProduct, images: [imgUrl], image: imgUrl });
                    else setNewProdForm({ ...newProdForm, images: [imgUrl] });
                  }}
                  placeholder="https://images.unsplash.com/..."
                />

                {/* Availability Status Toggle */}
                <div>
                  <label className="block mb-1 text-gray-800 font-black">Availability Status *</label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (editingProduct) {
                          setEditingProduct({ ...editingProduct, inStock: true, stock: 1, stock_count: 1 });
                        } else {
                          setNewProdForm({ ...newProdForm, inStock: true, stock: 1 });
                        }
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition border-2 ${
                        (editingProduct
                          ? (editingProduct.inStock !== false && (editingProduct.stock ?? editingProduct.stock_count ?? 0) > 0)
                          : (newProdForm.inStock !== false && (newProdForm.stock ?? 0) > 0))
                          ? 'bg-green-100 text-green-800 border-green-400'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-green-300'
                      }`}
                    >
                      Available
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (editingProduct) {
                          setEditingProduct({ ...editingProduct, inStock: false, stock: 0, stock_count: 0 });
                        } else {
                          setNewProdForm({ ...newProdForm, inStock: false, stock: 0 });
                        }
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition border-2 ${
                        (editingProduct
                          ? (editingProduct.inStock === false || (editingProduct.stock ?? editingProduct.stock_count ?? 0) <= 0)
                          : (newProdForm.inStock === false || (newProdForm.stock ?? 0) <= 0))
                          ? 'bg-red-100 text-red-800 border-red-400'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-red-300'
                      }`}
                    >
                      Sold Out
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-gray-800 font-black">Selling Price (Rs. PKR) *</label>
                  <input 
                    type="number" 
                    required
                    value={editingProduct ? editingProduct.price : newProdForm.price}
                    onChange={e => editingProduct ? setEditingProduct({...editingProduct, price: Number(e.target.value)}) : setNewProdForm({...newProdForm, price: Number(e.target.value)})}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-800 font-black">Product Description</label>
                  <textarea 
                    rows={3}
                    value={editingProduct ? (editingProduct.description || '') : newProdForm.description}
                    onChange={e => editingProduct ? setEditingProduct({...editingProduct, description: e.target.value}) : setNewProdForm({...newProdForm, description: e.target.value})}
                    placeholder="Write details about the product..."
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3">
                  <button type="button" onClick={() => { setEditingProduct(null); setIsAddProductModalOpen(false); }} className="px-5 py-2.5 bg-gray-100 rounded-xl font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-black rounded-xl shadow uppercase text-xs tracking-wider">
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Category Add / Edit */}
        {(editingCategory || isAddCategoryModalOpen) && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/60" onClick={() => { setEditingCategory(null); setIsAddCategoryModalOpen(false); }} />
            <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-50 space-y-4 max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-fade-in">
              <h3 className="text-lg font-black text-gray-900">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
              </h3>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (editingCategory) {
                  updateCategory(editingCategory.id, editingCategory);
                  setEditingCategory(null);
                } else {
                  if (!newCategoryData.name.trim()) return;
                  addCategory(newCategoryData.name, null, newCategoryData.image);
                  setIsAddCategoryModalOpen(false);
                }
              }} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block mb-1 text-gray-800 font-black">Category Name *</label>
                  <input 
                    type="text" 
                    required
                    value={editingCategory ? editingCategory.name : newCategoryData.name}
                    onChange={e => editingCategory ? setEditingCategory({...editingCategory, name: e.target.value}) : setNewCategoryData({...newCategoryData, name: e.target.value})}
                    placeholder="e.g. Footwear & Shoes"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                  />
                </div>

                {/* Dual Image Input: Category Cover Image */}
                <ImageUploaderInput 
                  label="Category Cover Image (Upload File OR Paste URL) *"
                  value={editingCategory ? editingCategory.image : newCategoryData.image}
                  onChange={imgUrl => {
                    if (editingCategory) setEditingCategory({ ...editingCategory, image: imgUrl });
                    else setNewCategoryData({ ...newCategoryData, image: imgUrl });
                  }}
                  placeholder="https://images.unsplash.com/..."
                />

                <div>
                  <label className="block mb-1 text-gray-800 font-black">Category Description</label>
                  <textarea 
                    rows={2}
                    value={editingCategory ? (editingCategory.description || '') : newCategoryData.description}
                    onChange={e => editingCategory ? setEditingCategory({...editingCategory, description: e.target.value}) : setNewCategoryData({...newCategoryData, description: e.target.value})}
                    placeholder="Brief description..."
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3">
                  <button type="button" onClick={() => { setEditingCategory(null); setIsAddCategoryModalOpen(false); }} className="px-4 py-2.5 bg-gray-100 rounded-xl font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-brand-orange text-white font-black rounded-xl shadow uppercase text-xs">
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Order Details */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/60" onClick={() => setSelectedOrderDetails(null)} />
            <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-50 space-y-6 max-h-[90vh] overflow-y-auto border-2 border-gray-200 animate-fade-in">
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-xl text-brand-orange">{selectedOrderDetails.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      selectedOrderDetails.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {selectedOrderDetails.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-bold mt-1">Placed on: {selectedOrderDetails.date || new Date().toISOString().split('T')[0]}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      if (window.confirm(`Delete order ${selectedOrderDetails.id}?`)) {
                        deleteOrder(selectedOrderDetails.id);
                        setSelectedOrderDetails(null);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition"
                    title="Delete Order"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedOrderDetails(null)} 
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Customer Contact Card */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs font-bold text-gray-800">
                <h4 className="text-brand-orange uppercase text-[11px] font-black tracking-wider">Customer Delivery Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p><span className="text-gray-500 font-medium">Customer:</span> {selectedOrderDetails.customerName}</p>
                  <p><span className="text-gray-500 font-medium">Phone:</span> {selectedOrderDetails.phone}</p>
                  <p><span className="text-gray-500 font-medium">Email:</span> {selectedOrderDetails.email || selectedOrderDetails.customer_email || 'N/A'}</p>
                  <p><span className="text-gray-500 font-medium">City:</span> {selectedOrderDetails.city || 'Lahore'}</p>
                </div>
                <p><span className="text-gray-500 font-medium">Address:</span> {selectedOrderDetails.address}</p>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-gray-900">Ordered Line Items</h4>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
                  {selectedOrderDetails.items?.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-black text-brand-orange shrink-0">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-extrabold text-gray-900">{item.name}</p>
                          {(item.selectedColor || item.selectedSize) && (
                            <p className="text-[10px] text-gray-500">
                              {item.selectedColor && `Color: ${item.selectedColor}`} {item.selectedSize && `| Size: ${item.selectedSize}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900">Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                        <p className="text-[10px] text-gray-500">Rs. {item.price?.toLocaleString()} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t-2 border-gray-100 pt-4">
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Payment Mode</span>
                  <span className="font-black text-xs text-gray-900">{selectedOrderDetails.paymentMethod}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-500 block">Total Amount Payable</span>
                  <span className="text-xl font-black text-brand-orange">Rs. {(selectedOrderDetails.totalAmount || selectedOrderDetails.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
};
