// Initial Default Data for Taskeen Variety Store (Pakistan Edition - PKR Rs.)

export const initialCategories = [
  {
    id: "beauty",
    name: "Beauty & Makeup",
    slug: "beauty-makeup",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    description: "Authentic lipsticks, foundations, blushers, eyeshadow palettes & makeup kits.",
    subcategories: [
      { id: "makeup-lips", name: "Lipsticks & Gloss", slug: "lipsticks-gloss" },
      { id: "makeup-face", name: "Foundations & Compact", slug: "foundations" },
      { id: "makeup-eyes", name: "Eyeshadows & Mascara", slug: "eyeshadows" },
      { id: "makeup-tools", name: "Brushes & Blenders", slug: "brushes" }
    ]
  },
  {
    id: "skincare",
    name: "Skincare Essentials",
    slug: "skincare",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    description: "Hydrating serums, face cleansers, sunscreens & moisturizers.",
    subcategories: [
      { id: "skin-serums", name: "Serums & Treatments", slug: "serums" },
      { id: "skin-cleansers", name: "Face Wash & Cleansers", slug: "cleansers" },
      { id: "skin-sunscreens", name: "Sunscreens & UV Protection", slug: "sunscreens" },
      { id: "skin-moisturizers", name: "Creams & Moisturizers", slug: "moisturizers" }
    ]
  },
  {
    id: "clothing",
    name: "Fashion Apparel",
    slug: "clothing",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80",
    description: "Trendy hoodies, casual shirts, women dresses & activewear.",
    subcategories: [
      { id: "cloth-women", name: "Women Collection", slug: "women" },
      { id: "cloth-men", name: "Men Shirts & Hoodies", slug: "men" },
      { id: "cloth-kids", name: "Kids Apparel", slug: "kids" },
      { id: "cloth-active", name: "Activewear & Sweatshirts", slug: "activewear" }
    ]
  },
  {
    id: "accessories",
    name: "Accessories & Watches",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    description: "Luxury watches, stylish sunglasses, hand bags & jewelry.",
    subcategories: [
      { id: "acc-watches", name: "Watches & Smartwatches", slug: "watches" },
      { id: "acc-bags", name: "Handbags & Backpacks", slug: "bags" },
      { id: "acc-eyewear", name: "Sunglasses & Glasses", slug: "sunglasses" },
      { id: "acc-jewelry", name: "Jewelry & Rings", slug: "jewelry" }
    ]
  }
];

export const initialProducts = [];
export const initialReviews = [];
export const initialCoupons = [];
export const initialOrders = [];

export const initialHomepageConfig = {
  storeTitle: "Taskeen Variety Store",
  tagline: "Authentic Cosmetics, Skincare & Fashion in Pakistan",
  announcementText: "⚡ Free Delivery Across Pakistan on Orders Over Rs. 3,000 | Cash on Delivery (COD) Available!",
  hero: {
    badgeText: "SPECIAL DISCOUNT 2026",
    title: "Quality Products, Easy Online Shopping",
    subtitle: "Shop authentic cosmetics, skincare serums, hoodies, and accessories. Fast delivery across Pakistan with Cash on Delivery.",
    buttonText: "Shop All Catalog",
    secondaryButtonText: "View Offers",
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
  },
  promoBanners: [
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
};

export const initialSEOConfig = {
  metaTitle: "Taskeen Variety Store | Authentic Online Store Pakistan",
  metaDescription: "Buy authentic makeup, skincare, clothing, and accessories in Pakistan. Cash on Delivery available.",
  keywords: "Taskeen, variety store pakistan, online shopping pakistan, makeup, skincare, clothing",
  ogImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
  robots: "index, follow",
  sitemapUrl: "https://taskeenvarietystore.com/sitemap.xml"
};
