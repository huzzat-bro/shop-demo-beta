import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
    Star,
    ShoppingCart,
    Truck,
    ShieldCheck,
    RotateCcw,
    Store,
    CheckCircle,
    Heart,
    Share2,
    Minus,
    Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useCartContext } from "@/hooks/CartContext";

// Type definitions based on the provided product structure
interface ProductImage {
    url: string;
    "content-type"?: string;
    id?: string;
}

interface ProductTag {
    id: string;
    name: string;
}

interface ProductCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
}

interface ProductVendor {
    id: string;
    name: string;
    slug: string;
    rating?: number;
    reviewCount?: number;
    logo?: string;
    joinedDate?: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    stock: number;
    sku: string;
    barcode?: string;
    brand?: string;
    specialOffer?: string;
    inventory?: {
        color?: string[];
        size?: string[];
        [key: string]: any;
    };
    images: ProductImage[];
    thumbnail: ProductImage;
    tags: ProductTag[];
    category: ProductCategory;
    vendor?: ProductVendor; // Multi‑vendor field
    rating?: number;
    reviewCount?: number;
    featured?: boolean;
    status?: string;
    type?: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    taxClass?: string;
    metaTitle?: string;
    metaDescription?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ProductDetailsProps {
    product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
    const { addItem } = useCartContext();
    const [selectedImage, setSelectedImage] = useState(
        product.images?.[0]?.url || product.thumbnail?.url || ""
    );
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string | null>(
        product.inventory?.color?.[0] || null
    );
    const navigate = useNavigate();

    const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
    const isOutOfStock = product.stock === 0;
    const lowStock = product.stock > 0 && product.stock <= 10;

    // Vendor info – if not present, use brand as fallback or a default
    const vendor = product.vendor || {
        id: "default-vendor",
        name: product.brand || "Official Store",
        slug: "official-store",
        rating: 4.5,
        reviewCount: 128,
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val >= 1 && val <= product.stock) {
            setQuantity(val);
        }
    };

    const incrementQuantity = () => {
        if (quantity < product.stock) setQuantity(quantity + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleAddToCart = () => {
        if (!isOutOfStock) {
            addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.url || product.thumbnail?.url || "",
                variant: { color: selectedColor }
            }, quantity);
        }
    }

    const handleBuyNow = () => {
        if (!isOutOfStock) {
            addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.url || product.thumbnail?.url || "",
                variant: { color: selectedColor }
            }, quantity);
            // Navigate to checkout (implement with useNavigate)
            navigate({ to: "/cart" });

        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* LEFT COLUMN - Image Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                        {isOnSale && (
                            <Badge className="absolute left-4 top-4 bg-red-500 text-white hover:bg-red-600">
                                Sale
                            </Badge>
                        )}
                        {product.specialOffer && !isOnSale && (
                            <Badge className="absolute left-4 top-4 bg-green-500 text-white hover:bg-green-600">
                                {product.specialOffer}
                            </Badge>
                        )}
                    </div>
                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img.url)}
                                    className={`relative aspect-square overflow-hidden rounded-md border-2 ${selectedImage === img.url ? "border-primary" : "border-transparent"
                                        }`}
                                >
                                    <img
                                        src={img.url}
                                        alt={`${product.name} thumbnail ${idx + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN - Product Details */}
                <div className="flex flex-col space-y-6">
                    {/* Title, Brand, Rating */}
                    <div>
                        <div className="flex items-start justify-between">
                            <div>
                                {product.brand && (
                                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                                )}
                                <h1 className="mt-1 text-3xl font-bold tracking-tight">{product.name}</h1>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon">
                                    <Heart className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {product.rating && (
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < Math.floor(product.rating!)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {product.rating} ({product.reviewCount} reviews)
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-primary">
                                ${product.price.toFixed(2)}
                            </span>
                            {isOnSale && (
                                <span className="text-lg text-muted-foreground line-through">
                                    ${product.compareAtPrice!.toFixed(2)}
                                </span>
                            )}
                        </div>
                        {lowStock && !isOutOfStock && (
                            <p className="mt-1 text-sm text-orange-600">
                                Only {product.stock} left in stock – order soon
                            </p>
                        )}
                        {isOutOfStock && (
                            <p className="mt-1 text-sm text-red-600">Out of stock</p>
                        )}
                    </div>

                    {/* Short Description */}
                    {product.shortDescription && (
                        <p className="text-muted-foreground">{product.shortDescription}</p>
                    )}

                    <Separator />

                    {/* Vendor Section */}
                    <div className="rounded-lg border p-4">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <Store className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{vendor.name}</h3>
                                    {vendor.rating && (
                                        <>
                                            <div className="flex items-center">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                <span className="ml-1 text-sm">{vendor.rating}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                ({vendor.reviewCount} ratings)
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Seller since {vendor.joinedDate || "2024"}
                                </p>
                                <Button variant="link" className="mt-2 h-auto p-0 text-sm" asChild>
                                    <Link to={`/`}>Visit Store</Link>
                                </Button>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Verified
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    {/* Inventory Options (Color) */}
                    {product.inventory?.color && product.inventory.color.length > 0 && (
                        <div>
                            <span className="font-medium">Color:</span>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {product.inventory.color.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`relative h-8 w-8 rounded-full border-2 ${selectedColor === color
                                            ? "border-primary ring-2 ring-primary/20"
                                            : "border-gray-300"
                                            }`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        title={color}
                                    >
                                        <span className="sr-only">{color}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity and Actions */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="font-medium">Quantity:</span>
                            <div className="flex items-center">
                                <button
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1 || isOutOfStock}
                                    className="flex h-8 w-8 items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 disabled:opacity-50"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    disabled={isOutOfStock}
                                    className="h-8 w-16 rounded-none border-gray-300 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                    onClick={incrementQuantity}
                                    disabled={quantity >= product.stock || isOutOfStock}
                                    className="flex h-8 w-8 items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-gray-100 disabled:opacity-50"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className="flex-3"
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleBuyNow}
                                disabled={isOutOfStock}
                                className="flex-2"
                            >
                                Buy Now
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Shipping & Returns Info */}
                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                        <div className="flex items-center gap-2">
                            <Truck className="h-5 w-5 text-muted-foreground" />
                            <span>Free shipping on orders over $50</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <RotateCcw className="h-5 w-5 text-muted-foreground" />
                            <span>30-day returns</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                            <span>2-year warranty</span>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div>
                        <h3 className="mb-2 text-lg font-semibold">Details</h3>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            {product.sku && (
                                <>
                                    <dt className="text-muted-foreground">SKU:</dt>
                                    <dd>{product.sku}</dd>
                                </>
                            )}
                            {product.barcode && (
                                <>
                                    <dt className="text-muted-foreground">Barcode:</dt>
                                    <dd>{product.barcode}</dd>
                                </>
                            )}
                            {product.category && (
                                <>
                                    <dt className="text-muted-foreground">Category:</dt>
                                    <dd>
                                        <Link
                                            to={`/`}
                                            className="text-primary hover:underline"
                                        >
                                            {product.category.name}
                                        </Link>
                                    </dd>
                                </>
                            )}
                            {product.tags && product.tags.length > 0 && (
                                <>
                                    <dt className="text-muted-foreground">Tags:</dt>
                                    <dd className="flex flex-wrap gap-1">
                                        {product.tags.map((tag) => (
                                            <Badge key={tag.id} variant="outline" className="text-xs">
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </dd>
                                </>
                            )}
                        </dl>
                    </div>

                    {/* Full Description */}
                    {product.description && (
                        <div>
                            <h3 className="mb-2 text-lg font-semibold">Description</h3>
                            <p className="text-muted-foreground whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}