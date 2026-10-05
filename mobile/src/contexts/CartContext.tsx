import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

type CartItem = {
  product_id: string;
  name: string;
  unit_price_cents: number;
  image_url: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  update: (productId: string, qty: number) => Promise<void>;
  clear: () => Promise<void>;
  total_cents: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('product_id, name, unit_price_cents, image_url, quantity')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const total_cents = items.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  async function add(item: Omit<CartItem, 'quantity'>, qty = 1) {
    if (!user) return;

    const existing = items.find((p) => p.product_id === item.product_id);
    const newQty = existing ? existing.quantity + qty : qty;

    await supabase.from('cart_items').upsert(
      {
        user_id: user.id,
        product_id: item.product_id,
        name: item.name,
        unit_price_cents: item.unit_price_cents,
        image_url: item.image_url,
        quantity: newQty,
      },
      { onConflict: 'user_id,product_id' }
    );

    setItems((prev) => {
      const exists = prev.find((p) => p.product_id === item.product_id);
      if (exists) {
        return prev.map((p) =>
          p.product_id === item.product_id ? { ...p, quantity: newQty } : p
        );
      }
      return [...prev, { ...item, quantity: newQty }];
    });
  }

  async function remove(productId: string) {
    if (!user) return;
    await supabase.from('cart_items').delete().eq('user_id', user.id).eq('product_id', productId);
    setItems((prev) => prev.filter((p) => p.product_id !== productId));
  }

  async function update(productId: string, qty: number) {
    if (!user) return;

    if (qty <= 0) {
      await supabase.from('cart_items').delete().eq('user_id', user.id).eq('product_id', productId);
      setItems((prev) => prev.filter((p) => p.product_id !== productId));
      return;
    }

    await supabase.from('cart_items').update({ quantity: qty }).eq('user_id', user.id).eq('product_id', productId);
    setItems((prev) =>
      prev.map((p) => (p.product_id === productId ? { ...p, quantity: qty } : p))
    );
  }

  async function clear() {
    if (!user) return;
    await supabase.from('cart_items').delete().eq('user_id', user.id);
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, loading, add, remove, update, clear, total_cents, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
