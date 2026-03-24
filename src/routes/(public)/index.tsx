import { ProductCard } from "@/components/layouts/public/product-card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/(public)/")({ component: App })

export const mockBanners = [
  {
    id: "banner-1", title: "Summer Collection 2026", subtitle: "Up to 40% off select items",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
    link: "/products", isActive: true, position: "hero", order: 1,
  },
  {
    id: "banner-2", title: "New Arrivals", subtitle: "Discover what's fresh",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200",
    link: "/products?filter=new", isActive: true, position: "hero", order: 2,
  },
  {
    id: "banner-3", title: "Free Shipping on Orders $100+", subtitle: "Limited time offer",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200",
    link: "/products", isActive: true, position: "promo1", order: 1,
  },
  {
    id: "banner-4", title: "Members Get 10% Extra", subtitle: "Sign up today",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
    link: "/auth", isActive: true, position: "promo2", order: 1,
  },
];
const heroBanners = [{
  title: "Summer Splash",
  subtitle: "Up to 50% off on beachwear",
  link: "",
  image: "https://files.instantdb.com/54846a19-b581-4c9b-a22e-618f8c2ffe26/9/c2276ac7-9c11-44b4-9393-23201eae6ee7?response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9maWxlcy5pbnN0YW50ZGIuY29tLzU0ODQ2YTE5LWI1ODEtNGM5Yi1hMjJlLTYxOGY4YzJmZmUyNi85L2MyMjc2YWM3LTljMTEtNDRiNC05MzkzLTIzMjAxZWFlNmVlNz9yZXNwb25zZS1jYWNoZS1jb250cm9sPXB1YmxpYyUyQyUyMG1heC1hZ2UlM0Q4NjQwMCUyQyUyMGltbXV0YWJsZSIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc3NDkxNTIwMH19fV19&Signature=c1oAAzwNyxh3~Z~WShtZvvQiIHT3PrTNXdMh-GwtGPDOFboprUSCILUjarVSlmyymFkLZXtzvSU~Re5Ur~qCvUXw3ASvW2C~0wUopltsnGlcOWytzFicd2rJk3dtJLGkM-a908cnnRNf2bsExv0h0GcfJglQ-2lNxLtRKbpHnn68YrqpN4CCr1vLSNpraOsYFyV9VahhJ3W~SdYRkoD9DWnzV6L~i2Q6mhVKK6ftsaPJ~MC2VRRY-saLXZ0atENrOyMnoC0yOD4z~LfqF7jOr7AJpQzkHAdJs6RFFJnA2aTBux4JzO-cwBQ~nQcOqNijp~cDTfGYpqsppNGoJCK4jw&Key-Pair-Id=K2D8SOWYIPDBRT"
}];

function App() {
  const { data } = db.useQuery({
    products: {
      category: {},
      tags: {},
      thumbnail: {}
    },
    categories: {}
  });
  const products = data?.products;

  const promo1 = mockBanners.find((b) => b.position === "promo1" && b.isActive);
  const promo2 = mockBanners.find((b) => b.position === "promo2" && b.isActive);

  const featuredProducts = products?.filter((p) => p.featured);
  const newArrivals = products?.filter((p) => p.createdAt);
  const bestSellers = products?.filter((p) => p.stock <= 10);
  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-secondary">
        {heroBanners[0] && (
          <div className="relative h-[60vh] md:h-[70vh] px-6 md:px-16">
            <img
              src={heroBanners[0].image || '/hero-banner.png'}
              alt={heroBanners[0].title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/50" />
            <div className="container relative flex h-full items-center">
              <div className="max-w-lg text-primary-foreground">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                  {heroBanners[0].title}
                </h1>
                {heroBanners[0].subtitle && (
                  <p className="mt-4 text-lg font-light tracking-wide opacity-90">
                    {heroBanners[0].subtitle}
                  </p>
                )}
                <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 px-8 h-12 text-sm uppercase tracking-widest font-semibold">
                  <Link to={heroBanners[0].link || "/products"}>
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="container py-16 px-2 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight uppercase">Featured</h2>
          <Link to="/" className="text-sm font-medium text-accent hover:underline uppercase tracking-wider">
            <Button variant={'link'}>View All <ArrowRight /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts?.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo Banner 1 */}
      {promo1 && (
        <section className="relative h-48 md:h-64 overflow-hidden">
          <img src={promo1.image} alt={promo1.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-primary/60" />
          <div className="container relative flex h-full items-center justify-center text-center">
            <div className="text-primary-foreground">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">{promo1.title}</h3>
              {promo1.subtitle && <p className="mt-2 text-sm opacity-80">{promo1.subtitle}</p>}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="container py-16 px-2 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold tracking-tight uppercase">New Arrivals</h2>
          <Link to="/" className="text-sm font-medium text-accent hover:underline uppercase tracking-wider">
            <Button variant={'link'}>View All <ArrowRight /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newArrivals?.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo Banner 2 */}
      {promo2 && (
        <section className="relative h-48 md:h-64 overflow-hidden">
          <img src={promo2.image} alt={promo2.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-accent/80" />
          <div className="container relative flex h-full items-center justify-center text-center">
            <div className="text-accent-foreground">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">{promo2.title}</h3>
              {promo2.subtitle && <p className="mt-2 text-sm opacity-90">{promo2.subtitle}</p>}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {
        bestSellers?.length! > 0 && (

          <section className="container py-16 px-2 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight uppercase">Best Sellers</h2>
              <Link to="/" className="text-sm font-medium text-accent hover:underline uppercase tracking-wider">
                <Button variant={'link'}>View All <ArrowRight /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {bestSellers?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

      {/* Categories */}
      <section className="container py-16 px-2 md:px-6">
        <h2 className="text-2xl font-bold tracking-tight uppercase mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data?.categories?.map((cat) => (
            <Link
              key={cat.id}
              to={`/`}
              className="group relative flex items-center justify-center h-32 p-2 bg-black/10"
            >
              <img src={cat.image} alt="" className="absolute top-0 bottom-0 right-0 w-full h-full object-cover -z-1" />
              <span className="text-sm font-semibold uppercase tracking-wider group-hover:text-accent-foreground transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
