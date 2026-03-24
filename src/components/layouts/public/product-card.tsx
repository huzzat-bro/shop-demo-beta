import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/hooks/CartContext";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";

// Define the shape of a product based on your JSON
export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    shortDescription: string;
    thumbnail: {
        id: string;
        path: string;
        url: string;
    } | undefined;

    featured?: boolean;
    stock: number;
    tags?: { id: string; name: string }[];
    // add other fields as needed
}

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCartContext()
    const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
    const isOutOfStock = product.stock === 0;

    const handleAddToCart = () => {
        if (!isOutOfStock) {
            addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.thumbnail?.url || "",
                variant: {}
            }, 1);
        }
    }


    // Format price with 2 decimal places and currency symbol
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "BDT", //USD
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };
    return (
        <main>
            <Link
                to={`/products/$slug`}
                params={{ slug: product.slug }}
                className="group block"
            >
                <div className="relative overflow-hidden bg-secondary aspect-square">
                    <img
                        src={product.thumbnail?.url}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.featured && (
                        <Badge className="absolute left-2 top-2 bg-amber-500 text-white hover:bg-amber-600">
                            Featured
                        </Badge>
                    )}
                    {isOnSale && (
                        <Badge className="absolute right-2 top-2 bg-red-500 text-white hover:bg-red-600">
                            Sale
                        </Badge>
                    )}
                    <Badge variant={'ghost'} className="absolute bottom-3 right-0">
                        <Star className="h-3 w-3 fill-amber-400" />
                        <span className="text-xs text-muted-foreground">
                            {4.5} ({3838})
                        </span>
                    </Badge>
                </div>
                <div className="mt-3 space-y-1">
                    <h3 className="text-sm font-medium tracking-tight line-clamp-1">{product.name}</h3>
                    {/* <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-accent" />
                        <span className="text-xs text-muted-foreground">
                            {4.5} ({3838})
                        </span>
                    </div> */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
                        {product.compareAtPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.compareAtPrice)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
            <Button
                className="w-full"
                size={'xs'}
                onClick={() => handleAddToCart()}
                disabled={product.stock === 0}
                variant={product.stock > 0 ? "default" : "ghost"}
            >
                {product.stock > 0 ? (
                    <>
                        <ShoppingCart />
                        Add to Cart
                    </>
                ) : "Out of Stock"}
            </Button>
        </main>

    );
}