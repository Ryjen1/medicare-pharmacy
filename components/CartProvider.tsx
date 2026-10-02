"use client";

import { createContext, useContext, useMemo, useEffect, useState, type ReactNode } from "react";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  update: (productId: string, qty: number) => void;
  clear: () => void;
  total_cents: number;
  count: number;
};

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = "shop.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo<CartState>(() => {
    const total_cents = items.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0);
    const count = items.reduce((s, i) => s + i.quantity, 0);
    return {
      items,
      total_cents,
      count,
      add: (item, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((p) => p.product_id === item.product_id);
          if (existing) {
            return prev.map((p) =>
              p.product_id === item.product_id ? { ...p, quantity: p.quantity + qty } : p,
            );
          }
          return [...prev, { ...item, quantity: qty }];
        }),
      remove: (productId) => setItems((prev) => prev.filter((p) => p.product_id !== productId)),
      update: (productId, qty) =>
        setItems((prev) =>
          prev
            .map((p) => (p.product_id === productId ? { ...p, quantity: Math.max(0, qty) } : p))
            .filter((p) => p.quantity > 0),
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}