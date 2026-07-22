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
  Globe, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  ExternalLink,
  DollarSign,
  AlertTriangle,
  Sparkles,
  Save
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    products, 
    categories, 
    orders, 
    homepageConfig, 
    coupons, 
    seoConfig,
    addProduct, 
    editProduct, 
    deleteProduct, 
    duplicateProduct,
    addCategory,
    deleteCategory,
    updateHomepageConfig,
    updateOrderStatus,
    addCoupon,
    deleteCoupon,
    updateSEOConfig,
    setCurrentView,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState('overview');

  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProdForm, setNewProdForm] = useState({
    name: '',
    brand: 'Taskeen Luxe',
    categoryId: 'beauty',
    subcategoryId: 'makeup-lips',
    price: 2499,
    originalPrice: 3500,
    discountPercentage: 28,
    stock: 30,
    isTrending: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"],
    colors: ["Default"],
    sizes: ["Standard"],
    description: "High quality product crafted for perfection.",
    specifications: { "Origin": "Pakistan" }
  });

  const [newCatName, setNewCatName] = useState('');
  const [selectedParentCatId, setSelectedParentCatId] = useState('');
  const [heroForm, setHeroForm] = useState(homepageConfig.hero);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    minSpend: 2000
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const lowStockCount = products.filter(p => p.stock < 10).length;

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (editingProduct) {
      editProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
    } else {
      addProduct(newProdForm);
      setIsAddProductModalOpen(false);
    }
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName, selectedParentCatId || null);
    setNewCatName('');
    setSelectedParentCatId('');
  };

  const handleSaveHomepageConfig = (e) => {
    e.preventDefault();
    updateHomepageConfig({ hero: heroForm });
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    addCoupon({
      id: `c-${Date.now()}`,
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type,
      value: Number(newCoupon.value),
      minSpend: Number(newCoupon.minSpend),
      description: `${newCoupon.value}${newCoupon.type === 'percentage' ? '%' : ' Rs.'} OFF on orders over Rs. ${newCoupon.minSpend}`,
      isActive: true
    });
    setNewCoupon({ code: '', type: 'percentage', value: 10, minSpend: 2000 });
  };

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-brand-black text-white rounded-3xl p-6 sm:p-8 mb-8 border-2 border-brand-orange shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Taskeen Admin Control Panel PK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Store Manager Dashboard (Rupees PKR)
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Manage products, pricing, nested categories, orders, coupons, and homepage text without editing code.
            </p>
          </div>

          <button 
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center space-x-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-md self-start md:self-auto"
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
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'discounts', label: `Coupons (${coupons.length})`, icon: Percent },
            { id: 'media', label: 'Media Library', icon: ImageIcon },
            { id: 'seo', label: 'SEO Settings', icon: Globe }
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition border-2 ${
                  activeTab === tab.id 
                    ? "bg-brand-black text-brand-orange border-brand-orange shadow-md" 
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Sales Revenue</p>
                  <h3 className="text-2xl font-black text-gray-900 mt-0.5">Rs. {totalRevenue.toLocaleString()}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-brand-orange flex items-center justify-center font-bold">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Orders</p>
                  <h3 className="text-2xl font-black text-gray-900 mt-0.5">{orders.length}</h3>
                  <p className="text-[10px] text-brand-orange font-bold">{pendingOrdersCount} Pending</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Products</p>
                  <h3 className="text-2xl font-black text-gray-900 mt-0.5">{products.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Low Stock Alerts</p>
                  <h3 className="text-2xl font-black text-red-600 mt-0.5">{lowStockCount}</h3>
                </div>
              </div>
            </div>

            {/* Orders */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-xs">
              <h3 className="text-base font-black text-gray-900 mb-4">Recent Customer Orders</h3>
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono font-black text-gray-900">{order.id}</td>
                        <td className="p-3">{order.customerName}</td>
                        <td className="p-3 text-gray-500">{order.date}</td>
                        <td className="p-3 text-brand-orange">Rs. {order.totalAmount?.toLocaleString()}</td>
                        <td className="p-3 text-gray-600">{order.paymentMethod}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-gray-200">
              <h3 className="text-base font-black text-gray-900">Products Catalog ({products.length})</h3>
              <button 
                onClick={() => setIsAddProductModalOpen(true)}
                className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-black px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bold">
                  <thead className="bg-gray-50 text-gray-600 uppercase border-b-2 border-gray-200">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded-lg border border-gray-300" />
                            <p className="font-extrabold text-gray-900 line-clamp-1">{product.name}</p>
                          </div>
                        </td>
                        <td className="p-3 capitalize">{product.categoryId}</td>
                        <td className="p-3 text-gray-900">Rs. {product.price.toLocaleString()}</td>
                        <td className="p-3">{product.stock} pcs</td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setEditingProduct(product)} className="p-1 text-gray-600 hover:text-brand-orange">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => duplicateProduct(product.id)} className="p-1 text-gray-600 hover:text-blue-600">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteProduct(product.id)} className="p-1 text-gray-600 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Product Add / Edit */}
        {(editingProduct || isAddProductModalOpen) && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/60" onClick={() => { setEditingProduct(null); setIsAddProductModalOpen(false); }} />
            <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl z-50 space-y-4 max-h-[90vh] overflow-y-auto border-2 border-gray-200">
              <h3 className="text-lg font-black text-gray-900">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product (PKR)'}
              </h3>
              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs font-bold">
                <div>
                  <label className="block mb-1">Product Name</label>
                  <input 
                    type="text" 
                    required
                    value={editingProduct ? editingProduct.name : newProdForm.name}
                    onChange={e => editingProduct ? setEditingProduct({...editingProduct, name: e.target.value}) : setNewProdForm({...newProdForm, name: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">Price (Rs.)</label>
                    <input 
                      type="number" 
                      required
                      value={editingProduct ? editingProduct.price : newProdForm.price}
                      onChange={e => editingProduct ? setEditingProduct({...editingProduct, price: Number(e.target.value)}) : setNewProdForm({...newProdForm, price: Number(e.target.value)})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      required
                      value={editingProduct ? editingProduct.stock : newProdForm.stock}
                      onChange={e => editingProduct ? setEditingProduct({...editingProduct, stock: Number(e.target.value)}) : setNewProdForm({...newProdForm, stock: Number(e.target.value)})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3">
                  <button type="button" onClick={() => { setEditingProduct(null); setIsAddProductModalOpen(false); }} className="px-4 py-2 bg-gray-100 rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-brand-orange text-white font-black rounded-xl shadow">
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
};
