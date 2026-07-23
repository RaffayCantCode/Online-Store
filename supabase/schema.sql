-- =========================================================
-- Taskeen Variety Store - Supabase PostgreSQL Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/rbpwdkulqmeagiohihpj/sql)
-- =========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image TEXT,
    description TEXT,
    subcategories JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. PRODUCTS TABLE
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. ORDERS TABLE
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    author TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    comment TEXT,
    date DATE DEFAULT CURRENT_DATE,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount NUMERIC NOT NULL,
    is_percentage BOOLEAN DEFAULT true,
    min_spend NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. HOMEPAGE CONFIG TABLE
CREATE TABLE IF NOT EXISTS homepage_config (
    id TEXT PRIMARY KEY DEFAULT 'main',
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_badge TEXT,
    hero_image TEXT,
    promo_banner_text TEXT,
    promo_banner_link TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. SEO CONFIG TABLE
CREATE TABLE IF NOT EXISTS seo_config (
    id TEXT PRIMARY KEY DEFAULT 'main',
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    og_image TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_config ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies allowing public read & access
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public All Categories" ON categories FOR ALL USING (true);

CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public All Products" ON products FOR ALL USING (true);

CREATE POLICY "Public Read Orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public All Orders" ON orders FOR ALL USING (true);

CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public All Reviews" ON reviews FOR ALL USING (true);

CREATE POLICY "Public Read Coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Public All Coupons" ON coupons FOR ALL USING (true);

CREATE POLICY "Public Read Homepage" ON homepage_config FOR SELECT USING (true);
CREATE POLICY "Public All Homepage" ON homepage_config FOR ALL USING (true);

CREATE POLICY "Public Read SEO" ON seo_config FOR SELECT USING (true);
CREATE POLICY "Public All SEO" ON seo_config FOR ALL USING (true);
