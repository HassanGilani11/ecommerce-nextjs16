export interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    description: string;
    category: string;
    image: string;
    tags?: string[];
}

export const CATEGORIES = ["All", "Apparel", "Accessories", "Footwear", "New Arrivals"];

export const PRODUCTS: Product[] = [
    {
        id: "1",
        slug: "classic-white-tee",
        name: "Classic White Tee",
        price: 35,
        description: "A premium weight cotton tee with a perfect fit.",
        category: "Apparel",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        tags: ["Basic", "Cotton", "White"],
    },
    {
        id: "2",
        slug: "denim-jacket",
        name: "Denim Jacket",
        price: 120,
        description: "Timeless denim jacket with a modern wash.",
        category: "Apparel",
        image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?q=80&w=800&auto=format&fit=crop",
        tags: ["Outerwear", "Denim", "Classic"],
    },
    {
        id: "3",
        slug: "leather-backpack",
        name: "Leather Backpack",
        price: 180,
        description: "Durable and stylish backpack made from 100% genuine leather.",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: "4",
        slug: "minimalist-watch",
        name: "Minimalist Watch",
        price: 150,
        description: "Elegant watch with a clean face and leather strap.",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
        tags: ["Minimalist", "Black", "Leather"],
    },
    {
        id: "5",
        slug: "running-shoes",
        name: "Running Shoes",
        price: 95,
        description: "Lightweight and breathable shoes for maximum comfort.",
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: "6",
        slug: "canvas-tote-bag",
        name: "Canvas Tote Bag",
        price: 25,
        description: "Versatile tote bag for your everyday essentials.",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
    },
];
