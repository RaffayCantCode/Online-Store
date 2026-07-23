# Taskeen Variety Store — E-Commerce Web Application

A full-featured, database-driven e-commerce platform built for **Taskeen Variety Store** (Pakistan Edition). Features a clean **Black / Orange / White** aesthetic, Pakistani Rupees (`Rs.`) currency, real-time data sync via **Supabase**, and an integrated role-based **Admin Control Dashboard** for managing products, orders, categories, promotions, and more.

**Live Store — Fast. Secure. Mobile-First.**

---

## Built With

- **React 18** — UI library with Context API for state management
- **Vite** — Fast build tool and dev server
- **Tailwind CSS** — Utility-first styling with dark mode support
- **Supabase** — PostgreSQL database with real-time subscriptions, used for all persistent data (products, categories, orders, users, homepage config, SEO)
- **Lucide React** — Lightweight icon library
- **Vite PWA** — Offline-ready progressive web app support

All editable content (products, categories, homepage banners, promo offers, coupons, orders) is stored in Supabase and syncs in real time across all visitors — no refresh needed.

---

## Key Features

### Storefront
- **Real-time catalog** — Products, categories, and promotions update instantly for all users
- **Dynamic categories** — Add or remove categories from the admin panel; they appear/disappear from the homepage and header automatically
- **Adaptive category cards** — Images automatically adjust layout (portrait vs landscape) based on their orientation
- **Instant search modal** — Filter by category, search by name/brand/description, shows live results with thumbnails and prices
- **Dynamic popular searches** — Most-viewed products (tracked per user session) appear as suggested search terms
- **Dark/Light theme** — Toggle button in the header, persisted to localStorage
- **Full checkout flow** — Cash on Delivery (COD) with order confirmation
- **Wishlist & cart** — Persisted per device

### Admin Dashboard
- **Product manager** — Add, edit, delete, duplicate products with images, pricing, discounts, stock, and badges (Featured, Best Seller, Trending, New Arrival, Sale)
- **Category manager** — Create top-level categories and nested subcategories; edit names, images, and descriptions
- **Bulk discount manager** — Apply percentage discounts to individual products or entire categories at once
- **Homepage editor** — Edit announcement bar text, hero banner (title, subtitle, background image, CTA buttons), and promo offer cards (dynamically add/remove up to 5, responsive sizing)
- **Order manager** — View, search, filter by status, update order status, and delete orders
- **Coupon system** — Create percentage or fixed discount codes with minimum spend requirements
- **User manager** — View registered users and assign roles
- **SEO editor** — Set meta title, description, and keywords per page

### Security
- **Role-based access** — Admin dashboard is guarded by `AdminGuard`; only users with `role: 'admin'` can access it
- **Session persistence** — Logged-in users remain signed in across page refreshes (localStorage)
- **No credential leaks** — Registration form uses generic placeholder text; no real account info exposed

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

---

## Database

The application uses **Supabase (PostgreSQL)** with real-time replication enabled. Tables are created via `scripts/setup_db.js` or the SQL schema in `supabase/schema.sql`.

Key tables:
- `products` — Full product catalog with pricing, images, stock, badges
- `categories` — Nested categories with subcategories (JSONB)
- `orders` — Customer orders with status tracking
- `users` — Registered users with roles
- `reviews` — Product reviews
- `coupons` — Discount codes
- `homepage_config` — JSONB config for announcement bar, hero, promo banners
- `seo_config` — JSONB config for page meta tags

---

## Project Structure

```
src/
├── App.jsx                     # Main app layout, view router
├── index.css                   # Global styles, dark mode variables
├── context/
│   └── StoreContext.jsx        # Global state: products, cart, auth, admin CRUD, real-time subs
├── lib/
│   └── supabase.js             # Supabase client, all DB API helpers
├── components/
│   ├── Header.jsx              # Nav bar, theme toggle, category nav links
│   ├── CategorySection.jsx     # Homepage category grid with adaptive layout
│   ├── PromoBanners.jsx        # Promo offer cards (responsive count)
│   ├── ProductCard.jsx         # Product display card with quick view
│   ├── CartDrawer.jsx          # Slide-in cart with coupon support
│   ├── SearchModal.jsx         # Search with category filter + popular searches
│   ├── AuthModal.jsx           # Login / Register / Profile modal
│   ├── CheckoutModal.jsx       # Full checkout form with COD
│   └── AdminPanel/
│       ├── AdminDashboard.jsx  # Full admin panel with all management tabs
│       └── AdminGuard.jsx      # Access control wrapper
├── data/
│   └── initialData.js          # Fallback data when Supabase is unavailable
└── assets/                     # Static assets
```

---

## Deployment

1. Set the environment variables on your hosting platform (Vercel, Netlify, Railway, etc.)
2. Run `npm run build` to generate the `dist/` folder
3. Deploy `dist/` to any static host, or use the built-in Vite preview

---

## License

Built for **Taskeen Variety Store**. All rights reserved.
