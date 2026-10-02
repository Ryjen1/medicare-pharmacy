"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderConfirmation } from "@/lib/mailgun";
import type { CartItem, Order, OrderItem } from "@/lib/types";

export type CheckoutInput = {
  customer_email: string;
  customer_name: string;
  shipping_address: string;
  shipping_postcode: string;
  shipping_country: string;
  items: CartItem[];
};

export async function placeOrder(input: CheckoutInput) {
  if (!input.items?.length) return { error: "Your cart is empty." };
  if (!input.customer_email || !input.customer_name || !input.shipping_address) {
    return { error: "Please fill out all required fields." };
  }

  const serverClient = createServerSupabase();
  const { data: userData } = await serverClient.auth.getUser();
  const user_id = userData.user?.id ?? null;

  const admin = createAdminClient();

  const productIds = input.items.map((i) => i.product_id);
  const { data: dbProducts, error: productError } = await admin
    .from("products")
    .select("id,name,price_cents,stock")
    .in("id", productIds);
  if (productError) return { error: productError.message };

  const priceLookup = new Map<
    string,
    { name: string; price_cents: number; stock: number }
  >();
  for (const p of dbProducts ?? []) priceLookup.set(p.id, p);

  const orderItems: {
    product_id: string;
    product_name: string;
    unit_price_cents: number;
    quantity: number;
  }[] = [];
  let total = 0;
  for (const item of input.items) {
    const p = priceLookup.get(item.product_id);
    if (!p) return { error: `Unknown product: ${item.product_id}` };
    if (item.quantity > p.stock) return { error: `Not enough stock for ${p.name}.` };
    orderItems.push({
      product_id: item.product_id,
      product_name: p.name,
      unit_price_cents: p.price_cents,
      quantity: item.quantity,
    });
    total += p.price_cents * item.quantity;
  }

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id,
      customer_email: input.customer_email,
      customer_name: input.customer_name,
      shipping_address: input.shipping_address,
      shipping_postcode: input.shipping_postcode,
      shipping_country: input.shipping_country,
      total_cents: total,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Could not create order." };
  }

  const { error: itemsInsertError } = await admin.from("order_items").insert(
    orderItems.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      product_name: i.product_name,
      unit_price_cents: i.unit_price_cents,
      quantity: i.quantity,
    })),
  );
  if (itemsInsertError) return { error: itemsInsertError.message };

  // Decrement stock. Done item-by-item because products can share ids between cart items.
  for (const i of orderItems) {
    const current = priceLookup.get(i.product_id)!;
    const { error: stockError } = await admin
      .from("products")
      .update({ stock: current.stock - i.quantity })
      .eq("id", i.product_id);
    if (stockError) {
      console.error("[checkout] stock decrement failed:", stockError.message);
    }
    current.stock -= i.quantity;
  }

  let emailWarning: string | null = null;
  try {
    const itemsForEmail: OrderItem[] = orderItems.map((i) => ({
      id: "",
      order_id: order.id,
      product_id: i.product_id,
      product_name: i.product_name,
      unit_price_cents: i.unit_price_cents,
      quantity: i.quantity,
    }));
    await sendOrderConfirmation({
      to: input.customer_email,
      customerName: input.customer_name,
      order: order as Order,
      items: itemsForEmail,
    });
  } catch (e: unknown) {
    emailWarning = e instanceof Error ? e.message : "Confirmation email failed to send.";
    console.error("[checkout] mailgun error:", e);
  }

  revalidatePath("/");
  revalidatePath("/products");

  return { orderId: order.id, emailWarning };
}