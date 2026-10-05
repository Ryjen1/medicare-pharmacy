"use client";

import { createContext, useContext, useMemo, useEffect, useState, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  update: (productId: string, qty: number) => void;
  clear: () => void;
  total_cents: number;
  count: number;
  loading: boolean;
};

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = "shop.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchCart = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {}
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select("product_id, name, unit_price_cents, image_url, quantity")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchCart();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const localCart = localStorage.getItem(STORAGE_KEY);
        if (localCart) {
          const localItems: CartItem[] = JSON.parse(localCart);
          if (localItems.length > 0) {
            migrateLocalCartToSupabase(localItems, session.user.id);
          }
        }
        fetchCart();
      } else {
        setItems([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchCart, supabase]);

  const migrateLocalCartToSupabase = async (localItems: CartItem[], userId: string) => {
    for (const item of localItems) {
      await supabase.from("cart_items").upsert(
        {
          user_id: userId,
          product_id: item.product_id,
          name: item.name,
          unit_price_cents: item.unit_price_cents,
          image_url: item.image_url,
          quantity: item.quantity,
        },
        { onConflict: "user_id,product_id" }
      );
    }
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {}
      }
    });
  }, [items, supabase]);

  const value = useMemo<CartState>(() => {
    const total_cents = items.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0);
    const count = items.reduce((s, i) => s + i.quantity, 0);
    return {
      items,
      total_cents,
      count,
      loading,
      add: async (item, qty = 1) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setItems((prev) => {
            const existing = prev.find((p) => p.product_id === item.product_id);
            if (existing) {
              return prev.map((p) =>
                p.product_id === item.product_id ? { ...p, quantity: p.quantity + qty } : p,
              );
            }
            return [...prev, { ...item, quantity: qty }];
          });
          return;
        }

        const existing = items.find((p) => p.product_id === item.product_id);
        const newQty = existing ? existing.quantity + qty : qty;

        await supabase.from("cart_items").upsert(
          {
            user_id: user.id,
            product_id: item.product_id,
            name: item.name,
            unit_price_cents: item.unit_price_cents,
            image_url: item.image_url,
            quantity: newQty,
          },
          { onConflict: "user_id,product_id" }
        );

        setItems((prev) => {
          const exists = prev.find((p) => p.product_id === item.product_id);
          if (exists) {
            return prev.map((p) =>
              p.product_id === item.product_id ? { ...p, quantity: newQty } : p,
            );
          }
          return [...prev, { ...item, quantity: newQty }];
        });
      },
      remove: async (productId) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", productId);
        }
        setItems((prev) => prev.filter((p) => p.product_id !== productId));
      },
      update: async (productId, qty) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (qty <= 0) {
          if (user) {
            await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", productId);
          }
          setItems((prev) => prev.filter((p) => p.product_id !== productId));
          return;
        }
        if (user) {
          await supabase.from("cart_items").update({ quantity: qty }).eq("user_id", user.id).eq("product_id", productId);
        }
        setItems((prev) =>
          prev.map((p) => (p.product_id === productId ? { ...p, quantity: qty } : p))
        );
      },
      clear: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("cart_items").delete().eq("user_id", user.id);
        }
        localStorage.removeItem(STORAGE_KEY);
        setItems([]);
      },
    };
  }, [items, loading, supabase]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}