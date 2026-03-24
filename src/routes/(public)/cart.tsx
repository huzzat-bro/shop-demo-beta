import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartContext } from "@/hooks/CartContext";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute('/(public)/cart')({
  component: RouteComponent,
})

function RouteComponent() {
  const { items, removeItem, updateQuantity, subtotal } = useCartContext();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      setDiscount(subtotal * 0.1);
      toast.success("Coupon applied! 10% off");
    } else {
      toast.error("Invalid coupon code");
      setDiscount(0);
    }
  };

  const total = subtotal - discount;

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center animate-fade-in">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40" />
        <h1 className="text-2xl font-bold mt-6">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Start shopping to add items to your cart.</p>
        <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="h-full min-h-screen">
      <div className="container p-4 md:p-8 animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight uppercase mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border">
                <div className="w-full h-28 bg-secondary shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-medium truncate pr-4">{item.name}</h3>
                    <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => removeItem(item.productId, item.variant)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center border">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground ml-auto">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border p-6 h-fit sticky top-24">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{subtotal >= 100 ? "Free" : "$9.99"}</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Coupon */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button onClick={handleApplyCoupon}>
                Apply
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${(total + (subtotal < 100 ? 9.99 : 0)).toFixed(2)}</span>
            </div>

            <Button asChild className="w-full mt-6 h-12 uppercase tracking-widest text-sm font-semibold">
              <Link to="/checkout">
                Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
