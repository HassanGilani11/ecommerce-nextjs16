import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function Home() {
  const supabase = await createClient()

  // Fetch Featured Products
  const { data: products } = await supabase
    .from('products')
    .select(`
        *,
        category:categories(name)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(4)

  const featuredProducts = products?.map(p => ({
    ...p,
    name: p.title,
    image: p.featured_image || "/placeholder.jpg",
    category: p.category?.name || "Uncategorized",
    slug: p.slug
  })) || []

  // Fetch Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .limit(3) // Limit to 3 for the grid layout

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] sm:h-[85vh] w-full overflow-hidden flex items-center justify-center bg-muted">
        <div className="absolute inset-0 z-0 bg-black">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop"
            alt="Hero background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/60 to-black/40" />
        </div>

        <div className="container mx-auto relative z-10 text-center px-4 sm:px-6 space-y-8 max-w-4xl">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter text-balance text-white">
              Redefining Modern Essentials
            </h1>
            <p className="text-base sm:text-xl text-zinc-300 text-balance max-w-2xl mx-auto px-4">
              Discover a curated collection of premium products designed for the discerning individual. Quality meets timeless aesthetic.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
            <Link href="/shop" className="w-full sm:w-auto">
              <Button size="lg" className="group w-full sm:w-auto rounded-full px-8 text-base transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 text-base bg-background/50 backdrop-blur transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 hover:bg-background hover:text-primary">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 px-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground line-clamp-2 sm:line-clamp-1">Expertly crafted pieces for your everyday rotation.</p>
          </div>
          <Link href="/shop" className="group flex items-center gap-1 text-sm font-semibold hover:text-primary transition-colors">
            View All Collection
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-6 sm:gap-y-8 px-4">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-zinc-50 rounded-3xl">
              <p className="text-muted-foreground text-lg">No products found.</p>
              <p className="text-sm text-zinc-400 mt-2">Add products in the admin panel to see them here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-secondary/30 py-16 sm:py-24">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center px-4">
          <div className="space-y-6 order-2 lg:order-1">
            <Badge className="rounded-full px-4 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Our Philosophy</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-balance">Quality over quantity, always.</h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              We believe that the products you surround yourself with should be more than just functional. They should be an extension of your identity—carefully chosen, exceptionally made, and built to last beyond the seasons.
            </p>
            <div className="grid sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <h4 className="font-bold">Sustainably Sourced</h4>
                <p className="text-sm text-muted-foreground">Every material is chosen with the planet in mind.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold">Exceptional Craft</h4>
                <p className="text-sm text-muted-foreground">Hand-finished details that make a difference.</p>
              </div>
            </div>
          </div>
          <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl order-1 lg:order-2 lg:skew-y-1 hover:skew-y-0 transition-transform duration-700">
            <img
              src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1000&auto=format&fit=crop"
              alt="Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Discover our specialized collections designed for different aspects of your life.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <Link key={category.id} href={`/product-category/${category.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500">
                <img
                  src={category.image_url || "/placeholder.jpg"}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-3xl font-bold text-white tracking-widest uppercase">{category.name}</h3>
                    <Button variant="outline" className="rounded-full bg-white/20 backdrop-blur-md border-white/40 text-white hover:bg-white hover:text-black opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      Explore Now
                    </Button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-zinc-50 rounded-3xl">
              <p className="text-muted-foreground text-lg">No categories found.</p>
              <p className="text-sm text-zinc-400 mt-2">Add categories in the admin panel to populate this section.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 px-8 py-16 sm:px-16 sm:py-24 text-center">
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
              Join the Movement
            </h2>
            <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">
              Sign up to our newsletter and receive early access to new collections, exclusive events, and $20 off your first order.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="group w-full sm:w-auto rounded-full px-8 h-14 text-base font-bold bg-white text-black hover:bg-zinc-200 transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95">
                  Join Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/shop" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-base font-bold text-white border-zinc-700 hover:bg-white hover:text-black bg-transparent transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95">
                  Shop the Collection
                </Button>
              </Link>
            </div>
          </div>
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]" />
          </div>
        </div>
      </section>
    </div>
  )
}
