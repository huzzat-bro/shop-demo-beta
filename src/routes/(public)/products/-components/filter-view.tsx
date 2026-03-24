import { Field, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { FunnelX, SlidersHorizontal } from "lucide-react";

interface FilterViewProps {
    priceRange: [number, number];
    onPriceRangeChange: (value: [number, number]) => void;
    minPrice: number;
    maxPrice: number;
    categoryId: string | null;
    onCategoryChange: (value: string | null) => void;
    productType: string | null;
    onProductTypeChange: (value: string | null) => void;
    onClearFilters: () => void;
}

export function FilterView({
    priceRange,
    onPriceRangeChange,
    minPrice,
    maxPrice,
    categoryId,
    onCategoryChange,
    productType,
    onProductTypeChange,
    onClearFilters,
}: FilterViewProps) {
    const { data } = db.useQuery({ categories: {} });

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                {/* Filter Header */}
                <div className="hidden md:block px-2 pt-4 pb-2 border-b">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal size={18} />
                        <h2 className="text-lg font-semibold">Filters</h2>
                    </div>
                </div>

                {/* Price Range */}
                <div className="px-2 mt-6">
                    <Field className="w-full max-w-xs">
                        <FieldTitle>Price Range</FieldTitle>
                        <FieldDescription>
                            Set your budget range ($
                            <span className="font-medium tabular-nums">{priceRange[0]}</span> - $
                            <span className="font-medium tabular-nums">{priceRange[1]}</span>).
                        </FieldDescription>
                        <div className="flex items-center gap-1">
                            <Input
                                className="w-16"
                                type="number"
                                value={priceRange[0]}
                                onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                                min={minPrice}
                                max={priceRange[1]}
                            />
                            <Slider
                                value={priceRange}
                                onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                                max={maxPrice}
                                min={minPrice}
                                step={1}
                                className="mt-2 w-full grow"
                                aria-label="Price Range"
                            />
                            <Input
                                className="w-16"
                                type="number"
                                value={priceRange[1]}
                                onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                                min={priceRange[0]}
                                max={maxPrice}
                            />
                        </div>
                    </Field>
                </div>

                {/* Category */}
                <div className="px-2 mt-6">
                    <Field className="w-full max-w-xs">
                        <FieldTitle>Category</FieldTitle>
                        <Select value={categoryId || undefined} onValueChange={(val) => onCategoryChange(val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {data && data?.categories?.length > 0 ? (
                                        data.categories.map((item) => (
                                            <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="null" disabled>No categories found</SelectItem>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FieldDescription>Select your product category.</FieldDescription>
                    </Field>
                </div>

                {/* Product Type */}
                <div className="px-2 mt-6">
                    <Field className="w-full max-w-xs">
                        <FieldTitle>Product Type</FieldTitle>
                        <Select value={productType || undefined} onValueChange={(val) => onProductTypeChange(val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose product type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="new-arrival">New Arrival</SelectItem>
                                    <SelectItem value="to-sell">Top Sell</SelectItem>
                                    <SelectItem value="special-offer">Special Offer</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FieldDescription>Select your product type.</FieldDescription>
                    </Field>
                </div>
            </div>

            {/* Clear Filters Button */}
            <div className="p-4 border-t mt-6">
                <Button className="w-full gap-2" onClick={onClearFilters}>
                    <FunnelX size={16} /> Clear Filters
                </Button>
            </div>
        </div>
    );
}