# 🛒 Modern eCommerce Next.js 16 + Supabase + Stripe

A premium, full-stack eCommerce application built with **Next.js 16 (App Router)**, **Supabase**, and **Stripe**. This project features a sophisticated shipping engine, real-time financial tracking, bulk product management, and a high-performance shopping experience.

![Project Preview](https://via.placeholder.com/1200x600?text=Ecommerce+Next.js+15+with+Stripe+Integration)

## 🚀 Features

### 🛍️ Shopping Experience
- **Modern UI**: Clean, high-performance interface with glassmorphism and smooth micro-animations.
- **Dynamic Catalog**: Browse products by category, brand, or search.
- **Shop Pagination**: Enhanced performance with server-side pagination for shop and category pages.
- **Persistent Cart**: Seamless cart state synchronized between local storage and user profiles.

### 💳 Payments & Finance
- **Stripe Integration**: Secure, PCI-compliant hosted checkout sessions with automated fulfillment.
- **Dynamic Payment Management**: Admin dashboard to toggle **Stripe**, **COD**, and **Bank Transfer** methods.
- **Bank Transfer Instructions**: Custom admin editor for providing manual payment details to customers.
- **Financial Insights**: Detailed breakdown of **Stripe fees** and **net payouts** in the admin order dashboard.

### 📦 Product Management
- **Bulk CSV Import**: High-performance, multi-step importer with data preview and mapping.
- **Auto-Creation**: Intelligently creates missing **Categories**, **Brands**, and **Tags** during CSV import.
- **Bulk Export**: Download your entire catalog with a single click for backup or external updates.

### 🚚 Advanced Shipping Engine
- **Zonal Shipping**: Configure shipping rates by country and specific ZIP code patterns (wildcards like `300*`).
- **Flexible Rates**: Supports Flat Rate, Weight-based, and Free Shipping thresholds.

### 🔐 Admin & Security
- **Secure Auth**: Powered by Supabase Auth with Row Level Security (RLS).
- **Comprehensive Panel**: Manage products, orders, users, and global site settings with a premium UI.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1.1 (App Router)](https://nextjs.org/)
- **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Payments**: [Stripe SDK](https://stripe.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (for Cart logic)
- **Forms/Validation**: [Zod](https://zod.dev/)
- **Notifications**: [Sonner](https://react-hot-toast.com/sonner)

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- A Supabase Project
- A Stripe Account

### 2. Environment Setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 3. Database Setup
Run the SQL migrations in your Supabase SQL Editor:
1. `supabase_schema.sql` (Core tables)
2. `shipping_schema.sql` (Shipping zones and rates)
3. `add_payment_settings_to_settings.sql` (Dynamic payment toggles)
4. `update_orders_schema_financials.sql` (Stripe fee tracking)

### 4. Installation
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see your store in action!

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
