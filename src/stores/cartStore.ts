import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ------------------------------------------------------------------------------
// 1. Helper functions (unchanged, but improved variant serialisation)
// ------------------------------------------------------------------------------

/**
 * Generates a unique key for an item based on productId + sorted variant fields.
 * Normalises undefined/null to 'null' and uses JSON.stringify for complex values.
 */
const getItemKey = (productId: string, variants?: Record<string, any>): string => {
    if (!variants || Object.keys(variants).length === 0) return productId;

    // Sort keys to ensure consistent ordering
    const sortedKeys = Object.keys(variants).sort();
    const variantString = sortedKeys
        .map(key => `${key}:${JSON.stringify(variants[key] ?? 'null')}`)
        .join('|');

    return `${productId}::${variantString}`;
};

/**
 * Extracts variant fields from a cart item (excludes base fields).
 */
const getVariants = (item: CartItem): Record<string, any> => {
    const { productId, name, price, image, quantity, ...variants } = item;
    return variants;
};

// ------------------------------------------------------------------------------
// 2. Type definitions
// ------------------------------------------------------------------------------

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    [key: string]: any; // dynamic variants
}

interface CartState {
    items: CartItem[];
}

interface CartActions {
    /**
     * Add an item to the cart. If quantity <= 0, it's ignored.
     */
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;

    /**
     * Remove a specific item (or all variants of a productId).
     */
    removeItem: (productId: string, variants?: Record<string, any>) => void;

    /**
     * Update quantity; if quantity <= 0, removes the item.
     */
    updateQuantity: (productId: string, quantity: number, variants?: Record<string, any>) => void;

    /**
     * Clear entire cart.
     */
    clearCart: () => void;

    /**
     * Increment/decrement quantity atomically.
     */
    incrementItem: (productId: string, amount?: number, variants?: Record<string, any>) => void;
}

interface CartComputed {
    /** Total number of items (sum of quantities) */
    totalItems: () => number;
    /** Total price (sum of price * quantity) */
    totalPrice: () => number;
    /** Find a specific item */
    getItem: (productId: string, variants?: Record<string, any>) => CartItem | undefined;
    /** Check if cart is empty */
    isEmpty: () => boolean;
}

export type CartStore = CartState & CartActions & CartComputed;

// ------------------------------------------------------------------------------
// 3. Detect server environment (TanStack Start / SSR)
// ------------------------------------------------------------------------------
const isServer = typeof window === 'undefined';

// ------------------------------------------------------------------------------
// 4. Create the store with persistence (SSR-safe)
// ------------------------------------------------------------------------------
export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            // --- State ---
            items: [],

            // --- Actions ---
            addItem: (item) => {
                const { productId, quantity = 1, ...rest } = item;
                if (quantity <= 0) return; // ignore zero/negative quantities

                // Extract variants from the rest (exclude base fields)
                const variants = Object.fromEntries(
                    Object.entries(rest).filter(
                        ([key]) => !['productId', 'name', 'price', 'image', 'quantity'].includes(key)
                    )
                );

                const key = getItemKey(productId, variants);

                set((state) => {
                    const index = state.items.findIndex(
                        i => getItemKey(i.productId, getVariants(i)) === key
                    );

                    if (index !== -1) {
                        // Update existing item: immutable copy
                        const newItems = [...state.items];
                        newItems[index] = {
                            ...newItems[index],
                            quantity: newItems[index].quantity + quantity,
                        };
                        return { items: newItems };
                    }

                    // Add new item
                    return {
                        items: [
                            ...state.items,
                            {
                                productId,
                                name: item.name,
                                price: item.price,
                                image: item.image,
                                quantity,
                                ...variants,
                            },
                        ],
                    };
                });
            },

            removeItem: (productId, variants = {}) => {
                const key = getItemKey(productId, variants);
                set((state) => ({
                    items: state.items.filter(
                        i => getItemKey(i.productId, getVariants(i)) !== key
                    ),
                }));
            },

            updateQuantity: (productId, quantity, variants = {}) => {
                if (quantity <= 0) {
                    get().removeItem(productId, variants);
                    return;
                }
                const key = getItemKey(productId, variants);
                set((state) => ({
                    items: state.items.map(i =>
                        getItemKey(i.productId, getVariants(i)) === key
                            ? { ...i, quantity }
                            : i
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            incrementItem: (productId, amount = 1, variants = {}) => {
                const key = getItemKey(productId, variants);
                set((state) => {
                    const newItems = state.items
                        .map(i => {
                            if (getItemKey(i.productId, getVariants(i)) === key) {
                                const newQty = Math.max(0, i.quantity + amount);
                                return { ...i, quantity: newQty };
                            }
                            return i;
                        })
                        .filter(i => i.quantity > 0); // remove zero-quantity items
                    return { items: newItems };
                });
            },

            // --- Computed values (as functions, not getters) ---
            totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

            totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

            getItem: (productId, variants = {}) => {
                const key = getItemKey(productId, variants);
                return get().items.find(
                    i => getItemKey(i.productId, getVariants(i)) === key
                );
            },

            isEmpty: () => get().items.length === 0,
        }),

        // Persistence configuration
        {
            name: 'cart-storage', // localStorage key
            storage: createJSONStorage(() => {
                if (isServer) {
                    // No-op storage on the server (prevents errors)
                    return {
                        getItem: () => null,
                        setItem: () => { },
                        removeItem: () => { },
                    };
                }
                return localStorage;
            }),
            partialize: (state) => ({ items: state.items }), // only persist items
            onRehydrateStorage: () => (state) => {
                // Safety check: ensure items is an array after rehydration
                if (state?.items && !Array.isArray(state.items)) {
                    console.error('Cart rehydration failed: items is not an array');
                    state.items = [];
                }
            },
        }
    )
);

// ------------------------------------------------------------------------------
// 5. Optimised Selectors (for use in components)
// ------------------------------------------------------------------------------

/**
 * Entire items array. Re‑renders on any cart change.
 * Use for cart list pages.
 */
export const useCartItems = () => useCartStore((state) => state.items);

/**
 * Total item count (sum of quantities). Ideal for badges.
 */
export const useCartTotalItems = () => useCartStore((state) => state.totalItems());

/**
 * Total price.
 */
export const useCartTotalPrice = () => useCartStore((state) => state.totalPrice());

/**
 * Get a specific item by productId + variants. Re‑renders only when that item changes.
 */
export const useCartItem = (productId: string, variants?: Record<string, any>) =>
    useCartStore((state) => state.getItem(productId, variants));

/**
 * Quantity of a specific item (0 if not in cart). Re‑renders only when that quantity changes.
 */
export const useItemQuantity = (productId: string, variants?: Record<string, any>) =>
    useCartStore((state) => {
        const key = getItemKey(productId, variants);
        return (
            state.items.find(
                i => getItemKey(i.productId, getVariants(i)) === key
            )?.quantity ?? 0
        );
    });

/**
 * Whether a specific item exists in the cart.
 */
export const useItemExists = (productId: string, variants?: Record<string, any>) =>
    useCartStore((state) => {
        const key = getItemKey(productId, variants);
        return state.items.some(
            i => getItemKey(i.productId, getVariants(i)) === key
        );
    });

/**
 * Whether the cart is empty.
 */
export const useCartEmpty = () => useCartStore((state) => state.isEmpty());