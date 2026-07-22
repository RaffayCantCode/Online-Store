// Initial Mock & Default Persistent Data for Taskeen Variety Store (Pakistan Edition - PKR Rs.)

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

export const initialProducts = [
  {
    id: "prod-1",
    name: "Radiant Glow Niacinamide Hydrating Serum 30ml",
    slug: "radiant-glow-serum",
    categoryId: "skincare",
    subcategoryId: "skin-serums",
    brand: "GlowEssence",
    price: 2499,
    originalPrice: 3500,
    discountPercentage: 28,
    rating: 4.9,
    reviewCount: 184,
    stock: 35,
    isTrending: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597262-838249719626?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Clear Natural"],
    sizes: ["30ml"],
    description: "Ultra-hydrating serum infused with Hyaluronic Acid and 10% Niacinamide. Clears dark spots and brightens complexion naturally.",
    features: [
      "Dermatologically Tested",
      "Clears Hyperpigmentation & Blemishes",
      "Suitable for All Skin Types",
      "Non-Greasy Lightweight Formula"
    ],
    specifications: {
      "Volume": "30 ml",
      "Country of Origin": "Pakistan",
      "Shelf Life": "24 Months"
    }
  },
  {
    id: "prod-2",
    name: "Velvet Matte Liquid Lipstick Kit (4 Shades Pack)",
    slug: "velvet-matte-liquid-lipstick-kit",
    categoryId: "beauty",
    subcategoryId: "makeup-lips",
    brand: "Taskeen Luxe",
    price: 1899,
    originalPrice: 2800,
    discountPercentage: 32,
    rating: 4.8,
    reviewCount: 240,
    stock: 50,
    isTrending: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Ruby Red", "Dusty Rose", "Nude Mocha", "Plum Velvet"],
    sizes: ["Full Set"],
    description: "Long-lasting 16-hour smudge-proof liquid lipsticks with Vitamin E. Smooth velvet finish that does not dry out lips.",
    features: [
      "Waterproof & Transfer-proof",
      "16-Hour Stay Formula",
      "Hydrating Vitamin E Blend",
      "Includes 4 Popular Daily Shades"
    ],
    specifications: {
      "Finish": "Velvet Matte",
      "Pack Quantity": "4 Lipsticks"
    }
  },
  {
    id: "prod-3",
    name: "Minimalist Chronograph Black Leather Watch",
    slug: "minimalist-chronograph-watch",
    categoryId: "accessories",
    subcategoryId: "acc-watches",
    brand: "Taskeen Timepieces",
    price: 4999,
    originalPrice: 7500,
    discountPercentage: 33,
    rating: 4.9,
    reviewCount: 120,
    stock: 15,
    isTrending: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Onyx Black", "Silver Rose"],
    sizes: ["40mm"],
    description: "Elegant wrist watch crafted with genuine leather strap and scratch-resistant mineral glass. Perfect for formal and casual wear.",
    features: [
      "Japanese Quartz Movement",
      "Genuine Top-Grain Leather Strap",
      "Scratch-Resistant Glass",
      "1 Year Store Warranty"
    ],
    specifications: {
      "Dial Diameter": "40 mm",
      "Warranty": "1 Year"
    }
  },
  {
    id: "prod-4",
    name: "Heavy Fleece Oversized Cotton Hoodie",
    slug: "heavy-fleece-oversized-hoodie",
    categoryId: "clothing",
    subcategoryId: "cloth-active",
    brand: "UrbanWear PK",
    price: 3200,
    originalPrice: 4500,
    discountPercentage: 28,
    rating: 4.7,
    reviewCount: 95,
    stock: 40,
    isTrending: false,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Charcoal Black", "Off-White", "Warm Amber"],
    sizes: ["M", "L", "XL"],
    description: "Premium 380 GSM heavy cotton hoodie designed with modern relaxed fit and warm inner lining.",
    features: [
      "100% Combed Cotton Fleece",
      "Double Lined Warm Hood",
      "Pre-Shrunk Premium Fabric"
    ],
    specifications: {
      "Fabric": "380 GSM Cotton",
      "Fit": "Oversized Fit"
    }
  },
  {
    id: "prod-5",
    name: "Invisible UV Sunscreen Gel SPF 50+",
    slug: "invisible-uv-sunscreen-gel",
    categoryId: "skincare",
    subcategoryId: "skin-sunscreens",
    brand: "GlowEssence",
    price: 1850,
    originalPrice: 2400,
    discountPercentage: 22,
    rating: 4.9,
    reviewCount: 310,
    stock: 60,
    isTrending: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Clear Gel"],
    sizes: ["50ml"],
    description: "Zero white-cast gel sunscreen. Non-greasy protection against UVA & UVB rays suitable for hot climate.",
    features: [
      "SPF 50+ Broad Spectrum",
      "Zero White Cast",
      "Sweat & Water Resistant"
    ],
    specifications: {
      "Volume": "50 ml",
      "SPF": "50+"
    }
  },
  {
    id: "prod-6",
    name: "Professional 12-Piece Soft Makeup Brush Set",
    slug: "professional-makeup-brush-set",
    categoryId: "beauty",
    subcategoryId: "makeup-tools",
    brand: "Taskeen Luxe",
    price: 2200,
    originalPrice: 3200,
    discountPercentage: 31,
    rating: 4.8,
    reviewCount: 140,
    stock: 25,
    isTrending: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Black & Gold"],
    sizes: ["Set of 12"],
    description: "Complete makeup brush set for liquid foundation, powder, contouring, and eyeshadow blending with pouch.",
    features: [
      "Ultra-Soft Synthetic Fibers",
      "Includes Protective Pouch",
      "No Shedding Guarantee"
    ],
    specifications: {
      "Quantity": "12 Brushes"
    }
  }
];

export const initialReviews = [
  {
    id: "rev-1",
    customerName: "Ayesha Malik (Lahore)",
    rating: 5,
    date: "2026-07-18",
    comment: "Delivery took only 2 days to Liberty Market Lahore! The serum is 100% original. Very easy site for ordering on Cash on Delivery.",
    productName: "Radiant Glow Niacinamide Hydrating Serum",
    verified: true
  },
  {
    id: "rev-2",
    customerName: "Usman Ghani (Karachi)",
    rating: 5,
    date: "2026-07-12",
    comment: "Very straightforward checkout! Ordered the leather watch on COD and received exact original product. Highly recommended Taskeen Store.",
    productName: "Minimalist Chronograph Black Leather Watch",
    verified: true
  },
  {
    id: "rev-3",
    customerName: "Fatima Noor (Islamabad)",
    rating: 5,
    date: "2026-07-05",
    comment: "The lipsticks quality is super smooth! Really appreciate how simple and easy the site is to navigate.",
    productName: "Velvet Matte Liquid Lipstick Kit",
    verified: true
  }
];

export const initialCoupons = [
  {
    id: "c-1",
    code: "TASKEEN10",
    type: "percentage",
    value: 10,
    minSpend: 2000,
    description: "10% OFF on orders above Rs. 2,000",
    isActive: true
  },
  {
    id: "c-2",
    code: "WELCOME500",
    type: "fixed",
    value: 500,
    minSpend: 4000,
    description: "Rs. 500 FLAT Discount on orders over Rs. 4,000",
    isActive: true
  }
];

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

export const initialOrders = [
  {
    id: "ORD-78192",
    customerName: "Kamran Khan",
    email: "kamran@example.com",
    phone: "0300-1234567",
    address: "House 45, Street 12, F-8/3, Islamabad",
    date: "2026-07-21",
    totalAmount: 5699,
    status: "Completed",
    paymentMethod: "Cash on Delivery",
    items: [
      { id: "prod-1", name: "Radiant Glow Serum", quantity: 1, price: 2499 },
      { id: "prod-4", name: "Cotton Oversized Hoodie", quantity: 1, price: 3200 }
    ]
  }
];

export const initialSEOConfig = {
  metaTitle: "Taskeen Variety Store | Authentic Online Store Pakistan",
  metaDescription: "Buy authentic makeup, skincare, clothing, and accessories in Pakistan. Cash on Delivery available.",
  keywords: "Taskeen, variety store pakistan, online shopping pakistan, makeup, skincare, clothing",
  ogImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
  robots: "index, follow",
  sitemapUrl: "https://taskeenvarietystore.com/sitemap.xml"
};
