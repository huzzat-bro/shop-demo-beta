import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

/**
 * Represents a cart item with a dynamic variant object.
 * The `variant` can hold any number of key‑value pairs (e.g., size, color, material).
 */
export interface LocalCartItem {
  /** Unique identifier of the base product */
  productId: string;
  /** Product name (display) */
  name: string;
  /** Unit price (in the store's currency) */
  price: number;
  /** Image URL for the product */
  image: string;
  /** Quantity of this specific variant in the cart */
  quantity: number;
  /** Dynamic variant attributes (e.g., { size: "M", color: "blue" }) */
  variant: Record<string, any>;
}

const CART_KEY = "buybro_cart";

/**
 * Safely reads the cart from localStorage.
 * Returns an empty array if no data is found or parsing fails.
 */
function getStoredCart(): LocalCartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Persists the cart to localStorage.
 */
function saveCart(items: LocalCartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

/**
 * Generates a unique key for a cart item based on productId and variant.
 * This ensures items with different variants are treated as separate entries.
 */
function getItemKey(item: Pick<LocalCartItem, "productId" | "variant">): string {
  return `${item.productId}|${JSON.stringify(item.variant)}`;
}

/**
 * A React hook that provides shopping cart functionality with localStorage persistence.
 * Supports dynamic product variants (size, color, etc.) and synchronises cart state across browser tabs.
 *
 * @returns Cart state and management functions
 *
 * @example
 * ```tsx
 * const { items, addItem, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCart();
 *
 * // Add a product with variants
 * addItem({
 *   productId: "123",
 *   name: "T-Shirt",
 *   price: 29.99,
 *   image: "/shirt.jpg",
 *   variant: { size: "M", color: "red" }
 * }, 2);
 *
 * // Update quantity of a specific variant
 * updateQuantity("123", { size: "M", color: "red" }, 3);
 *
 * // Remove a variant
 * removeItem("123", { size: "M", color: "red" });
 * ```
 */
export function useCart() {
  const [items, setItems] = useState<LocalCartItem[]>(getStoredCart);

  // Sync cart across browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_KEY) {
        const newItems = e.newValue ? JSON.parse(e.newValue) : [];
        setItems(newItems);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /**
   * Adds a product (or a specific variant) to the cart.
   * If the same product+variant already exists, the quantity is increased by `qty`.
   * Displays a success toast on addition.
   *
   * @param product - The product data (without quantity)
   * @param qty - Quantity to add (must be > 0, defaults to 1)
   */
  const addItem = useCallback(
    (product: Omit<LocalCartItem, "quantity">, qty = 1) => {
      if (qty <= 0) {
        console.warn("addItem called with non‑positive quantity");
        return;
      }
      setItems((prev) => {
        const key = getItemKey(product);
        const existingIndex = prev.findIndex((i) => getItemKey(i) === key);

        let updated: LocalCartItem[];
        if (existingIndex !== -1) {
          // Increase quantity of existing item
          updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + qty,
          };
        } else {
          // Add new item
          updated = [...prev, { ...product, quantity: qty }];
        }
        saveCart(updated);
        toast.success(`${product.name} added to cart`);
        return updated;
      });
    },
    []
  );

  /**
   * Removes a specific product variant from the cart.
   *
   * @param productId - ID of the product
   * @param variant - The variant object (must match exactly the one used when adding)
   */
  const removeItem = useCallback(
    (productId: string, variant: Record<string, any>) => {
      setItems((prev) => {
        const key = getItemKey({ productId, variant });
        const updated = prev.filter((i) => getItemKey(i) !== key);
        saveCart(updated);
        return updated;
      });
    },
    []
  );

  /**
   * Updates the quantity of a specific product variant.
   * If the quantity becomes zero, consider calling `removeItem` instead.
   *
   * @param productId - ID of the product
   * @param variant - The variant object
   * @param quantity - New quantity (must be >= 1)
   */
  const updateQuantity = useCallback(
    (productId: string, variant: Record<string, any>, quantity: number) => {
      if (quantity < 1) {
        console.warn("updateQuantity called with quantity < 1");
        return;
      }
      setItems((prev) => {
        const key = getItemKey({ productId, variant });
        const updated = prev.map((i) =>
          getItemKey(i) === key ? { ...i, quantity } : i
        );
        saveCart(updated);
        return updated;
      });
    },
    []
  );

  /**
   * Empties the entire cart.
   */
  const clearCart = useCallback(() => {
    setItems([]);
    saveCart([]);
  }, []);

  // Derived state
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    /** Array of items currently in the cart */
    items,
    /** Adds an item to the cart (or increases quantity if same variant exists) */
    addItem,
    /** Removes a specific variant from the cart */
    removeItem,
    /** Changes the quantity of a specific variant (must be ≥ 1) */
    updateQuantity,
    /** Removes all items from the cart */
    clearCart,
    /** Total price of all items (sum of price × quantity) */
    subtotal,
    /** Total number of items (sum of quantities) */
    totalItems,
  } as const;
}