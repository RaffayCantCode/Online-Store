# Taskeen Variety Store - E-Commerce Web Application

A modern, fast, mobile-first e-commerce website built for **Taskeen Variety Store** (Pakistan Edition). Designed with a clean **Black / Orange / White** aesthetic, high contrast for maximum usability (boomer-friendly navigation), Pakistani Rupees (`Rs.`) currency, and an integrated role-based Admin Control Dashboard.

---

## 🚀 One-Click Quick Start (Windows)

Simply double-click **`start_app.bat`** in the project root folder. It will:
1. Automatically open your web browser to **`http://localhost:3000/`**.
2. Start the local server.

---

## 📷 Where to Put the Store Logo PNG

To customize the store logo with your own transparent PNG image:

1. Save your transparent logo file as **`logo.png`**.
2. Place it inside the **`public/`** folder of this project:
   ```text
   Online-Store/
   ├── public/
   │   ├── logo.png   <-- Place your transparent PNG logo here!
   │   └── favicon.svg
   ```
3. The website header will automatically load `public/logo.png` across all devices (mobile, tablet, desktop).
4. *Alternative*: You can also update or change the logo URL dynamically through the **Admin Dashboard -> Homepage Editor** without editing code!

---

## ⚡ Key Features

- **Pakistani Rupees (`Rs.`) Currency**: All pricing, filters, shopping cart calculations, delivery charges (Rs. 250 / Free over Rs. 3,000), and checkout totals are formatted in PKR (`Rs.`).
- **Boomer-Friendly Usability**: Toned-down, clean, ultra-readable design with large explicit buttons (**"ADD TO CART"**, **"BUY NOW (COD)"**, **"ORDER ON WHATSAPP"**).
- **Unlimited Nested Categories**: Dynamic accordion tree for categories and subcategories (e.g. *Beauty & Makeup -> Lipsticks, Foundations, Eyeshadows, Brushes*).
- **Instant Search Modal**: Fast autocomplete modal showing product thumbnails, prices, stock badges, and category match pills.
- **Fast Cash on Delivery (COD) Checkout**: Simple 3-step checkout with customer info, address, delivery notes, and instant printable order confirmation slip.
- **WhatsApp Fast Order Button**: Direct one-click WhatsApp order integration for instant customer communication.
- **Role-Based Admin Security**: Admin Panel is strictly guarded by role permissions (`role: 'admin'`).

---

## 🔒 Security & Admin Dashboard Access

The website enforces role-based access control. Only authorized administrator accounts can access the Admin Dashboard (`/admin`).

### Default Demo Credentials:
- **Admin Account**:
  - **Email**: `admin@taskeen.com`
  - **Password**: `admin123`
  - *Access*: Full access to manage products, categories, homepage hero banner, orders, coupons, and SEO settings.
- **Customer Account**:
  - **Email**: `customer@gmail.com`
  - **Password**: `user123`

---

## 🛠️ Manual Installation & Terminal Commands

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Run local development server:
   ```bash
   npm run dev
   ```

3. Build for production deployment:
   ```bash
   npm run build
   ```

---

## 📄 License & Credits

Built for **Taskeen Variety Store**. All rights reserved.
