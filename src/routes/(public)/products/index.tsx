import { ProductCard } from '@/components/layouts/public/product-card'
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { createFileRoute } from '@tanstack/react-router'
import { ListFilter, Search, SlidersHorizontalIcon, Loader2 } from 'lucide-react';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { FilterView } from './-components/filter-view';
import { db } from '@/lib/db';
import PageLoader from '@/components/layouts/loader/page-loader';

export const Route = createFileRoute('/(public)/products/')({
  component: RouteComponent,
})

const BATCH_SIZE = 12;

function RouteComponent() {
  const {
    data,
    isLoading,
    error,
    canLoadNextPage,
    loadNextPage,
  } = db.useInfiniteQuery({
    products: {
      $: { limit: BATCH_SIZE, order: { serverCreatedAt: 'asc' } },
      thumbnail: {},
      category: {},
      images: {},
      tags: {},
    },
  });

  const products = data?.products || [];

  // Manual loading state for next page
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset loading state when new products arrive
  const prevProductsLength = useRef(products.length);
  useEffect(() => {
    if (products.length > prevProductsLength.current) {
      setIsLoadingMore(false);
    }
    prevProductsLength.current = products.length;
  }, [products]);

  // Price range derived from all products
  const minPrice = useMemo(() => {
    if (products.length === 0) return 0;
    return Math.min(...products.map(p => p.price));
  }, [products]);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  // Filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [productType, setProductType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (categoryId && product.category?.id !== categoryId) return false;
      if (productType && product.type !== productType) return false;
      if (debouncedSearch && !product.name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'name_asc': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

    return filtered;
  }, [products, priceRange, categoryId, productType, debouncedSearch, sortBy]);

  // Intersection observer for infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && canLoadNextPage && !isLoadingMore) {
          setIsLoadingMore(true);
          loadNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [canLoadNextPage, isLoadingMore, loadNextPage]);

  const clearFilters = useCallback(() => {
    setPriceRange([minPrice, maxPrice]);
    setCategoryId(null);
    setProductType(null);
    setSearchQuery('');
    setSortBy('price_asc');
  }, [minPrice, maxPrice]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <p className="text-destructive">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  return (
    <main className="w-full h-full min-h-svh relative">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block col-span-1 sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <FilterView
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
            productType={productType}
            onProductTypeChange={setProductType}
            onClearFilters={clearFilters}
          />
        </div>

        <div className="col-span-3">
          <div className="px-4 py-6 bg-background">
            {/* <h1 className="text-2xl font-bold tracking-tight">All Products</h1>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p> */}
            <img
              className='w-full h-24 object-cover'
              src={'https://files.instantdb.com/54846a19-b581-4c9b-a22e-618f8c2ffe26/2/46a2ea56-331b-4b79-823f-684083599257?response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9maWxlcy5pbnN0YW50ZGIuY29tLzU0ODQ2YTE5LWI1ODEtNGM5Yi1hMjJlLTYxOGY4YzJmZmUyNi8yLzQ2YTJlYTU2LTMzMWItNGI3OS04MjNmLTY4NDA4MzU5OTI1Nz9yZXNwb25zZS1jYWNoZS1jb250cm9sPXB1YmxpYyUyQyUyMG1heC1hZ2UlM0Q4NjQwMCUyQyUyMGltbXV0YWJsZSIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc3NDkxNTIwMH19fV19&Signature=wbSZ5FrKoIXkIDWK-SbNPHCvQ60GeCCMjSLu1ygRMH1SedJviJfc7r03Xcu~AwE1X5U48n2~v66IOSr-PQhvUscFTfMM~t6K~pXEO2hRmCsnaOmtBVtRMm-asNJAyRq4xMFrHK3tx8bZDb050lImDS2ggLea776VHzrdx7IgwipCgwryWETaL8tGTYgHwg5feZiTNq6psNKvMUd5Z3JWGTs28dxNHSnTwRd9QblTG-igjQRB0PnkQFj-1pTakbFe88ZiOXRsRTs5~LhWiEnY6SEy3tDFO4QYLpyhr9HTWbdGPrNvnBYm2vhOrQ3G9hxOJkUAlil6kUSCxx9ZuN4FoA&Key-Pair-Id=K2D8SOWYIPDBRT'} alt="" />
          </div>

          {/* Toolbar */}
          <div className="px-2 py-3 flex items-center gap-4 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 top-16 sticky">
            <div className="block md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontalIcon />
                  </Button>
                </SheetTrigger>
                <SheetContent side='left' className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-4">
                      <ListFilter size={18} /> Filter
                    </SheetTitle>
                  </SheetHeader>
                  <FilterView
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    categoryId={categoryId}
                    onCategoryChange={setCategoryId}
                    productType={productType}
                    onProductTypeChange={setProductType}
                    onClearFilters={clearFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center flex-1 gap-1">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button size="icon">
                <Search />
              </Button>
            </div>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort <ListFilter className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                    <DropdownMenuRadioItem value="price_asc">Price: Low to High</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price_desc">Price: High to Low</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name_asc">Name: A to Z</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 p-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} className="flex justify-center py-8">
            {isLoadingMore ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : canLoadNextPage ? (
              <span className="text-sm text-muted-foreground">Scroll for more</span>
            ) : filteredProducts.length > 0 ? (
              <span className="text-sm text-muted-foreground">You've reached the end</span>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}