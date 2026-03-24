import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartContext } from "@/hooks/CartContext";
import { toast } from "sonner";

type Step = 1 | 2 | 3;
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/checkout')({
  component: RouteComponent,
})

function RouteComponent() {
  const { items, subtotal, clearCart } = useCartContext();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [shipping, setShipping] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", zipCode: "", country: "",
  });

  if (items.length === 0) {
    navigate({ to: '/cart' });
    return null;
  }

  const total = subtotal + (subtotal < 100 ? 9.99 : 0);

  const steps = [
    { num: 1, label: "Shipping" },
    { num: 2, label: "Payment" },
    { num: 3, label: "Review" },
  ];

  const handlePlaceOrder = () => {
    clearCart();
    toast.success("Order placed successfully!");
    navigate({ to: '/' });
  };

  return (
    <div className="container max-w-3xl py-8 animate-fade-in">
      {/* Steps */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`h-8 w-8 flex items-center justify-center text-sm font-bold ${step > s.num
                ? "bg-accent text-accent-foreground"
                : step === s.num
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
                }`}
            >
              {step > s.num ? <Check className="h-4 w-4" /> : s.num}
            </div>
            <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
            {i < steps.length - 1 && <div className="w-12 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1: Shipping */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-tight">Shipping Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase tracking-wider">Full Name</Label>
              <Input value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Phone</Label>
              <Input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs uppercase tracking-wider">Street Address</Label>
              <Input value={shipping.street} onChange={(e) => setShipping({ ...shipping, street: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">City</Label>
              <Input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">State</Label>
              <Input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">ZIP Code</Label>
              <Input value={shipping.zipCode} onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Country</Label>
              <Input value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} />
            </div>
          </div>
          <Button
            className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90 uppercase tracking-widest"
            onClick={() => {
              if (!shipping.fullName || !shipping.street || !shipping.city) {
                toast.error("Please fill in required fields");
                return;
              }
              setStep(2);
            }}
          >
            Continue to Payment
          </Button>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-tight">Payment</h2>
          <div className="border p-6 text-center text-muted-foreground">
            <p className="text-sm">Payment integration placeholder</p>
            <p className="text-xs mt-2">In production, Stripe or another payment processor would be integrated here.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 uppercase tracking-widest"
              onClick={() => setStep(3)}
            >
              Review Order
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-tight">Review & Confirm</h2>

          <div className="border p-4 space-y-2 text-sm">
            <h4 className="font-semibold">Shipping to:</h4>
            <p>{shipping.fullName}</p>
            <p>{shipping.street}, {shipping.city}, {shipping.state} {shipping.zipCode}</p>
          </div>

          <div className="border p-4 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 uppercase tracking-widest"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
