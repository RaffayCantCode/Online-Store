import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rbpwdkulqmeagiohihpj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'your-supabase-anon-key-here'
);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'placeholder-anon-key-for-init'
);

export const dbAPI = {
  // Real-time subscriptions
  subscribeToTable(table, callback, event = '*') {
    if (!isSupabaseConfigured) return null;
    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', 
        { event, schema: 'public', table },
        (payload) => {
          if (callback) callback(payload);
        }
      )
      .subscribe();
    return channel;
  },

  unsubscribe(channel) {
    if (channel) supabase.removeChannel(channel);
  },

  // Users
  async getUsers() {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch users error:', e.message);
      return null;
    }
  },

  async getUser(email) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('users').select('*').eq('email', email.trim().toLowerCase()).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch user error:', e.message);
      return null;
    }
  },

  async saveUser(user) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('users').upsert({
        id: user.id,
        email: user.email.trim().toLowerCase(),
        name: user.name,
        phone: user.phone || null,
        role: user.role || 'customer'
      }).select().single();
      if (error) console.error('Supabase save user error:', error);
      return data;
    } catch (e) {
      console.error('Supabase save user exception:', e);
      return null;
    }
  },

  async updateUserRole(userId, newRole) {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId);
      if (error) console.error('Supabase update user role error:', error);
    } catch (e) {
      console.error('Supabase update user role exception:', e);
    }
  },

  // Products
  async getProducts() {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch products error:', e.message);
      return null;
    }
  },

  async saveProduct(product) {
    if (!isSupabaseConfigured) return null;
    try {
      const payload = {
        id: product.id,
        name: product.name,
        slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: product.price,
        original_price: product.originalPrice || product.original_price || null,
        rating: product.rating || 5.0,
        review_count: product.reviewCount || product.review_count || 0,
        category: product.categoryId || product.category || 'general',
        subcategory: product.subcategoryId || product.subcategory || null,
        image: (product.images && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
        gallery: product.images || product.gallery || [],
        description: product.description || '',
        is_featured: Boolean(product.isFeatured || product.is_featured),
        is_bestseller: Boolean(product.isBestSeller || product.is_bestseller),
        is_new: Boolean(product.isNewArrival || product.is_new),
        in_stock: product.inStock !== false && product.in_stock !== false,
        stock_count: product.stock || product.stock_count || 50,
        colors: product.colors || [],
        sizes: product.sizes || [],
        brand: product.brand || '',
        discount_percentage: product.discountPercentage || product.discount_percentage || 0,
        is_trending: Boolean(product.isTrending || product.is_trending),
        is_sale: Boolean(product.isSale || product.is_sale)
      };
      const { data, error } = await supabase.from('products').upsert(payload).select().single();
      if (error) console.error('Supabase save product error:', error);
      return data;
    } catch (e) {
      console.error('Supabase save product exception:', e);
      return null;
    }
  },

  async deleteProduct(id) {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) console.error('Supabase delete product error:', error);
    } catch (e) {
      console.error('Supabase delete product exception:', e);
    }
  },

  // Categories
  async getCategories() {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch categories error:', e.message);
      return null;
    }
  },

  async saveCategory(category) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('categories').upsert({
        id: category.id,
        name: category.name,
        slug: category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        image: category.image || '',
        description: category.description || '',
        subcategories: category.subcategories || []
      }).select().single();
      if (error) console.error('Supabase save category error:', error);
      return data;
    } catch (e) {
      console.error('Supabase save category exception:', e);
      return null;
    }
  },

  async deleteCategory(id) {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) console.error('Supabase delete category error:', error);
    } catch (e) {
      console.error('Supabase delete category exception:', e);
    }
  },

  // Homepage Config
  async getHomepageConfig() {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('homepage_config').select('*').eq('id', 'main').single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch homepage_config error:', e.message);
      return null;
    }
  },

  async saveHomepageConfig(config) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('homepage_config').upsert({
        id: 'main',
        config: config
      }).select().single();
      if (error) console.error('Supabase save homepage_config error:', error);
      return data;
    } catch (e) {
      console.error('Supabase save homepage_config exception:', e);
      return null;
    }
  },

  // SEO Config
  async getSEOConfig() {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('seo_config').select('*').eq('id', 'main').single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch seo_config error:', e.message);
      return null;
    }
  },

  async saveSEOConfig(config) {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('seo_config').upsert({
        id: 'main',
        config: config
      }).select().single();
      if (error) console.error('Supabase save seo_config error:', error);
      return data;
    } catch (e) {
      console.error('Supabase save seo_config exception:', e);
      return null;
    }
  },

  // Orders
  async getOrders() {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch orders error:', e.message);
      return null;
    }
  },

  async createOrder(order) {
    if (!isSupabaseConfigured) return null;
    try {
      const payload = {
        id: order.id,
        customer_name: order.customerName || order.customer_name || 'Customer',
        customer_email: order.email || order.customerEmail || order.customer_email || 'customer@gmail.com',
        phone: order.phone || '03001234567',
        address: order.address || '',
        city: order.city || 'Lahore',
        payment_method: order.paymentMethod || order.payment_method || 'Cash on Delivery (COD)',
        items: order.items || [],
        total: order.total || order.totalAmount || 0,
        status: order.status || 'Pending'
      };
      const { data, error } = await supabase.from('orders').insert([payload]).select().single();
      if (error) console.error('Supabase create order error:', error);
      return data;
    } catch (e) {
      console.error('Supabase create order exception:', e);
      return null;
    }
  },

  async updateOrderStatus(orderId, status) {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (error) console.error('Supabase update order status error:', error);
    } catch (e) {
      console.error('Supabase update order status exception:', e);
    }
  },

  async deleteOrder(orderId) {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) console.error('Supabase delete order error:', error);
    } catch (e) {
      console.error('Supabase delete order exception:', e);
    }
  },

  // Reviews
  async getReviews() {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('reviews').select('*');
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch reviews error:', e.message);
      return null;
    }
  },

  async addReview(review) {
    if (!isSupabaseConfigured) return null;
    try {
      const payload = {
        id: review.id || `rev-${Date.now()}`,
        product_id: review.productId || review.product_id || 'prod-1',
        author: review.author || review.customerName || 'Customer',
        rating: review.rating || 5,
        comment: review.comment || '',
        date: review.date || new Date().toISOString().split('T')[0],
        verified: review.verified !== false
      };
      const { data, error } = await supabase.from('reviews').insert([payload]).select().single();
      if (error) console.error('Supabase add review error:', error);
      return data;
    } catch (e) {
      console.error('Supabase add review exception:', e);
      return null;
    }
  },

  // Coupons
  async getCoupons() {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('coupons').select('*');
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch coupons error:', e.message);
      return null;
    }
  },

  async saveCoupon(coupon) {
    if (!isSupabaseConfigured) return null;
    try {
      const payload = {
        id: coupon.id,
        code: coupon.code,
        discount: coupon.discount ?? coupon.value ?? 10,
        is_percentage: coupon.isPercentage ?? (coupon.type !== 'fixed'),
        min_spend: coupon.minSpend || 0,
        is_active: coupon.isActive !== false
      };
      const { data, error } = await supabase.from('coupons').upsert(payload).select().single();
      if (error) console.error('Supabase save coupon error:', error);
      return data;
    } catch (e) {
      console.error('Supabase save coupon exception:', e);
      return null;
    }
  },

  async deleteCoupon(id) {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) console.error('Supabase delete coupon error:', error);
    } catch (e) {
      console.error('Supabase delete coupon exception:', e);
    }
  }
};
