# 🛒 Modern eCommerce Next.js 16 + Supabase + Stripe

A premium, full-stack eCommerce application built with **Next.js 16 (App Router)**, **Supabase**, and **Stripe**. This project features a sophisticated shipping engine, real-time financial tracking for admins, and a stunning, responsive design.

![Project Preview](https://via.placeholder.com/1200x600?text=Ecommerce+Next.js+15+with+Stripe+Integration)

## 🚀 Features

### 🛍️ Shopping Experience
- **Modern UI**: Clean, high-performance interface with glassmorphism and smooth micro-animations.
- **Dynamic Catalog**: Browse products by category, brand, or status (New Arrivals, Featured).
- **Persistent Cart**: Seamless cart state synchronized between local storage and user profiles.
- **Smart Checkout**: Intelligent address validation and shipping cost calculation.

### 💳 Payments & Finance
- **Stripe Integration**: Secure, PCI-compliant hosted checkout sessions.
- **Automated Fulfillment**: Real-time payment verification and automated order status updates.
- **Admin Financial Insights**: Detailed breakdown of **Stripe fees** and **net payouts** directly in the order dashboard.
- **Multi-method Support**: Choose between Stripe (Card) and Cash on Delivery (COD).

### 🚚 Advanced Shipping Engine
- **Zonal Shipping**: Configure shipping rates by country and specific ZIP code patterns (supporting wildcards like `300*`).
- **Flexible Rates**: Supports Flat Rate, Weight-based, and Free Shipping thresholds.
- **Strict Matching**: Ensures accurate shipping calculation based on the user's location.

### 🔐 Admin & Security
- **Secure Auth**: Powered by Supabase Auth with Row Level Security (RLS) for data protection.
- **Comprehensive Admin Panel**: Manage products, categories, brands, orders, and users with ease.
- **Shipping Management**: Visual editor for shipping zones and rates.
- **Email Notifications**: Automated status update emails sent to customers.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1.1 (App Router)](https://nextjs.org/)
- **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Payments**: [Stripe SDK](https://stripe.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms/Validation**: [Zod](https://zod.dev/)
- **Notifications**: [Sonner](https://react-hot-toast.com/sonner)

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- A Supabase Project
- A Stripe Account (for Secret/Publishable keys)

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 3. Database Setup
Run the SQL migrations provided in the root directory in your Supabase SQL Editor:
- `supabase_schema.sql` (Core tables)
- `shipping_schema.sql` (Shipping logic)
- `update_orders_schema_financials.sql` (Stripe tracking)

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
