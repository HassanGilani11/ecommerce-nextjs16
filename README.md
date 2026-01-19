# 🚀 Premium Next.js eCommerce Admin & Storefront

A state-of-the-art, high-performance eCommerce platform built with **Next.js 16**, **TypeScript**, and **Supabase**. This project features a sophisticated admin dashboard, real-time analytics, and a seamless media management system.

![Project Preview](https://github.com/HassanGilani11/ecommerce-nextjs16/raw/main/public/preview.png) *(Add a real preview image to public/preview.png)*

## ✨ Key Features

### 🛠️ Advanced Admin Dashboard
- **Comprehensive Analytics**: Real-time tracking of Sales, Orders, and Top Performing Products/Categories using **Service Role** security.
- **Product Management**: Intuitive interface for managing inventory, pricing, categories, and brands with auto-slug generation.
- **User Management**: Secure profile management with role-based access control (RBAC).
- **Dynamic Media Gallery**: A powerful, bucket-based media picker for products, categories, and user avatars.

### 🍱 Tech Stack
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **State & Notifications**: [Sonner](https://sonner.stevenly.me/)

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- Supabase Account

### 2. Environment Setup
Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Installation
```bash
# Clone the repository
git clone https://github.com/HassanGilani11/ecommerce-nextjs16.git

# Install dependencies
npm install

# Run the development server
npm run dev
```

### 4. Database Schema
Apply the provided SQL scripts in the `supabase_schema.sql` (and other `.sql` fix files) to your Supabase SQL Editor to set up the necessary tables and RLS policies.

## 📱 Features Breakdown

### 📊 Real-time Analytics
The analytics dashboard provides deep insights into your store's performance, utilizing the `SUPABASE_SERVICE_ROLE_KEY` to securely calculate net sales and trends across custom date ranges.

### 🖼️ Media Management
Integrated `MediaGalleryModal` allows for easy image uploads and selection from multiple storage buckets (`products`, `profile`, `categories`, `brands`), ensuring a consistent UI throughout the admin panel.

## 📄 License
This project is private and intended for use by Hassan Gilani.

---
Built with ❤️ by [Hassan Gilani](https://github.com/HassanGilani11)
