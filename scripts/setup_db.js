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

    // 1. Create / Update Tables
    console.log("Creating/updating database tables...");

    await client.query(`

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
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
        brand TEXT DEFAULT '',
        discount_percentage NUMERIC DEFAULT 0,
        is_trending BOOLEAN DEFAULT false,
        is_sale BOOLEAN DEFAULT false,
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
        config JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS seo_config (
        id TEXT PRIMARY KEY DEFAULT 'main',
        config JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Enable real-time for all tables
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS categories;
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS products;
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS orders;
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS reviews;
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS coupons;
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS users;
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS homepage_config;
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS seo_config;
    `);
    console.log("All tables created/updated and real-time enabled!");

    // 2. Seed Accounts
    console.log("Seeding default user accounts...");
    await client.query(`
      INSERT INTO users (id, email, name, role)
      VALUES 
        ('user-admin-maryam', 'maryam12mzzzz@gmail.com', 'Maryam Admin', 'admin'),
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

    // 4. Seed Homepage Config
    console.log("Seeding homepage configuration...");
    await client.query(`
      INSERT INTO homepage_config (id, config)
      VALUES ('main', $1)
      ON CONFLICT (id) DO UPDATE SET config = EXCLUDED.config, updated_at = NOW();
    `, [JSON.stringify(initialHomepageConfig)]);

    // 5. Seed SEO Config
    console.log("Seeding SEO configuration...");
    await client.query(`
      INSERT INTO seo_config (id, config)
      VALUES ('main', $1)
      ON CONFLICT (id) DO UPDATE SET config = EXCLUDED.config, updated_at = NOW();
    `, [JSON.stringify(initialSEOConfig)]);

    console.log("SUCCESS: All database tables created, updated, and seeded in Supabase PostgreSQL!");
    console.log("Real-time replication is enabled for all tables.");
  } catch (err) {
    console.error("Database setup error:", err);
  } finally {
    await client.end();
  }
}

run();
