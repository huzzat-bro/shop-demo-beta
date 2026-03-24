import React, { createContext, useContext } from "react";
import { useCart, type LocalCartItem } from "@/hooks/useCart";

interface CartContextType {
  items: LocalCartItem[];
  addItem: (product: Omit<LocalCartItem, "quantity">, qty?: number) => void;
  removeItem: (productId: string, variant: Record<string, any>) => void;
  updateQuantity: (productId: string, variant: Record<string, any>, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return ctx;
}