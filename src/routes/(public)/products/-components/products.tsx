import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

type SortOption = "newest" | "price-asc" | "price-desc" | "popular" | "rating";

export default function ProductsPage() {
    //   const [searchParams] = useSearchParams();
    //   const searchQuery = searchParams.get("search") || "";
    //   const filterParam = searchParams.get("filter") || "";
    //   const categoryParam = searchParams.get("category") || "";

    const [sort, setSort] = useState<SortOption>("newest");
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        categoryParam ? [categoryParam] : []
    );


    const [minRating, setMinRating] = useState(0);

    const toggleCategory = (slug: string) => {
        setSelectedCategories((prev) =>
            prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
        );
    };

    const filtered = useMemo(() => {
        let result = [...mockProducts];

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
            );
        }

        // Filter param
        if (filterParam === "new") result = result.filter((p) => p.isNewArrival);
        if (filterParam === "best") result = result.filter((p) => p.isBestSeller);
        if (filterParam === "featured") result = result.filter((p) => p.isFeatured);

        // Category
        if (selectedCategories.length > 0) {
            const catIds = mockCategories
                .filter((c) => selectedCategories.includes(c.slug))
                .map((c) => c.id);
            result = result.filter((p) => catIds.includes(p.categoryId));
        }

        // Price
        result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Rating
        if (minRating > 0) {
            result = result.filter((p) => p.rating >= minRating);
        }

        // Sort
        switch (sort) {
            case "price-asc": result.sort((a, b) => a.price - b.price); break;
            case "price-desc": result.sort((a, b) => b.price - a.price); break;
            case "popular": result.sort((a, b) => b.reviewCount - a.reviewCount); break;
            case "rating": result.sort((a, b) => b.rating - a.rating); break;
            case "newest": result.sort((a, b) => b.createdAt - a.createdAt); break;
        }

        return result;
    }, [searchQuery, filterParam, selectedCategories, priceRange, minRating, sort]);

    const FilterPanel = () => (
        <div className="space-y-6">
            {/* Categories */}
            <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Category</h4>
                <div className="space-y-2">
                    {mockCategories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                checked={selectedCategories.includes(cat.slug)}
                                onCheckedChange={() => toggleCategory(cat.slug)}
                            />
                            <span className="text-sm">{cat.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Price Range</h4>
                <Slider
                    min={0}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>

            {/* Rating */}
            <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Min Rating</h4>
                <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map((r) => (
                        <Button
                            key={r}
                            variant={minRating === r ? "default" : "outline"}
                            size="sm"
                            className="text-xs"
                            onClick={() => setMinRating(r)}
                        >
                            {r === 0 ? "All" : `${r}+`}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Reset */}
            <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 500]);
                    setMinRating(0);
                }}
            >
                <X className="h-3 w-3 mr-1" /> Reset Filters
            </Button>
        </div>
    );

    return (
        <div className="container py-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight uppercase">
                        {searchQuery ? `Search: "${searchQuery}"` : "All Products"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">{filtered.length} products</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Mobile filter trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="md:hidden">
                                <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72">
                            <SheetTitle className="text-sm font-semibold uppercase tracking-wider mb-6">Filters</SheetTitle>
                            <FilterPanel />
                        </SheetContent>
                    </Sheet>

                    <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                        <SelectTrigger className="w-44 h-9 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price-asc">Price: Low → High</SelectItem>
                            <SelectItem value="price-desc">Price: High → Low</SelectItem>
                            <SelectItem value="popular">Most Popular</SelectItem>
                            <SelectItem value="rating">Highest Rated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Desktop sidebar */}
                <aside className="hidden md:block w-56 shrink-0">
                    <FilterPanel />
                </aside>

                {/* Grid */}
                <div className="flex-1">
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {filtered.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-lg font-medium">No products found</p>
                            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
