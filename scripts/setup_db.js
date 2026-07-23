import pg from 'pg';
import {
  initialCategories,
  initialProducts,
  initialReviews,
  initialCoupons,
  initialHomepageConfig,
  initialOrders,
  initialSEOConfig
} from '../src/data/initialData.js';

const { Client } = pg;

const connectionString = "postgresql://postgres.rbpwdkulqmeagiohihpj:Maryam%23000asif@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres";

async function run() {
  console.log("Connecting to Supabase PostgreSQL database...");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected successfully to Supabase!");

    // 1. Create Tables
    console.log("Creating database tables...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        image TEXT,
        description TEXT,
        subcategories JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        price NUMERIC NOT NULL,
        original_price NUMERIC,
        rating NUMERIC DEFAULT 5.0,
        review_count INTEGER DEFAULT 0,
        category TEXT NOT NULL,
        subcategory TEXT,
        image TEXT NOT NULL,
        gallery JSONB DEFAULT '[]'::jsonb,
        description TEXT,
        is_featured BOOLEAN DEFAULT false,
        is_bestseller BOOLEAN DEFAULT false,
        is_new BOOLEAN DEFAULT false,
        in_stock BOOLEAN DEFAULT true,
        stock_count INTEGER DEFAULT 50,
        colors JSONB DEFAULT '[]'::jsonb,
        sizes JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        payment_method TEXT DEFAULT 'Cash on Delivery (COD)',
        items JSONB NOT NULL,
        total NUMERIC NOT NULL,
        status TEXT DEFAULT 'Pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        author TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        comment TEXT,
        date DATE DEFAULT CURRENT_DATE,
        verified BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS coupons (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        discount NUMERIC NOT NULL,
        is_percentage BOOLEAN DEFAULT true,
        min_spend NUMERIC DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS homepage_config (
        id TEXT PRIMARY KEY DEFAULT 'main',
        hero_title TEXT,
        hero_subtitle TEXT,
        hero_badge TEXT,
        hero_image TEXT,
        promo_banner_text TEXT,
        promo_banner_link TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS seo_config (
        id TEXT PRIMARY KEY DEFAULT 'main',
        meta_title TEXT,
        meta_description TEXT,
        keywords TEXT,
        og_image TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("All tables created successfully!");

    // 2. Seed Accounts (Admin & Customer)
    console.log("Seeding default user accounts (Admin & Customer)...");
    await client.query(`
      INSERT INTO users (id, email, name, role)
      VALUES 
        ('user-admin', 'admin@taskeen.com', 'Taskeen Admin', 'admin'),
        ('user-customer', 'customer@gmail.com', 'Customer PK', 'customer')
      ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, role = EXCLUDED.role;
    `);

    // 3. Seed Categories
    console.log("Seeding categories...");
    for (const cat of initialCategories) {
      await client.query(`
        INSERT INTO categories (id, name, slug, image, description, subcategories)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, image = EXCLUDED.image, description = EXCLUDED.description, subcategories = EXCLUDED.subcategories;
      `, [cat.id, cat.name, cat.slug, cat.image, cat.description, JSON.stringify(cat.subcategories || [])]);
    }

    // 4. Seed Products
    console.log("Seeding products...");
    for (const prod of initialProducts) {
      const mainCategory = prod.categoryId || prod.category || 'general';
      const subCategory = prod.subcategoryId || prod.subcategory || null;
      const mainImage = (prod.images && prod.images[0]) || prod.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80';
      const galleryImages = prod.images || (prod.gallery ? prod.gallery : [mainImage]);

      await client.query(`
        INSERT INTO products (id, name, slug, price, original_price, rating, review_count, category, subcategory, image, gallery, description, is_featured, is_bestseller, is_new, in_stock, stock_count, colors, sizes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, rating = EXCLUDED.rating, in_stock = EXCLUDED.in_stock;
      `, [
        prod.id, prod.name, prod.slug, prod.price, prod.originalPrice || prod.original_price || null,
        prod.rating || 5.0, prod.reviewCount || 0, mainCategory, subCategory,
        mainImage, JSON.stringify(galleryImages), prod.description || '',
        Boolean(prod.isFeatured || prod.is_featured), Boolean(prod.isBestSeller || prod.is_bestseller),
        Boolean(prod.isNewArrival || prod.is_new), prod.inStock !== false, prod.stock || prod.stock_count || 50,
        JSON.stringify(prod.colors || []), JSON.stringify(prod.sizes || [])
      ]);
    }

    // 5. Seed Coupons
    console.log("Seeding coupons...");
    for (const c of initialCoupons) {
      const discountVal = c.discount ?? c.value ?? 10;
      const isPercent = c.isPercentage ?? (c.type !== 'fixed');

      await client.query(`
        INSERT INTO coupons (id, code, discount, is_percentage, min_spend, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET discount = EXCLUDED.discount, min_spend = EXCLUDED.min_spend;
      `, [c.id, c.code, discountVal, isPercent, c.minSpend || 0, c.isActive !== false]);
    }

    // 6. Seed Orders
    console.log("Seeding initial orders...");
    for (const o of initialOrders) {
      await client.query(`
        INSERT INTO orders (id, customer_name, customer_email, phone, address, city, payment_method, items, total, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;
      `, [
        o.id, o.customerName || o.customer_name || 'Customer', o.email || o.customerEmail || o.customer_email || 'customer@gmail.com',
        o.phone || '03001234567', o.address || 'Street 1, Main Market', o.city || 'Lahore',
        o.paymentMethod || o.payment_method || 'Cash on Delivery (COD)', JSON.stringify(o.items || []),
        o.total || o.totalAmount || 0, o.status || 'Pending'
      ]);
    }

    // 7. Seed Reviews
    console.log("Seeding initial reviews...");
    for (const r of initialReviews) {
      const authorName = r.author || r.customerName || 'Customer';
      await client.query(`
        INSERT INTO reviews (id, product_id, author, rating, comment, date, verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING;
      `, [r.id, r.productId || r.product_id || 'prod-1', authorName, r.rating || 5, r.comment || '', r.date || '2026-07-01', r.verified !== false]);
    }

    console.log("SUCCESS: All database tables created and seeded in Supabase PostgreSQL!");
  } catch (err) {
    console.error("Database setup error:", err);
  } finally {
    await client.end();
  }
}

run();
