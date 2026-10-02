"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";
import { placeOrder } from "@/app/actions/placeOrder";

export default function CheckoutPage() {
  const { items, total_cents, clear } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    customer_email: "",
    customer_name: "",
    shipping_address: "",
    shipping_postcode: "",
    shipping_country: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await placeOrder({ ...form, items });
    setSubmitting(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    clear();
    const qs = new URLSearchParams({ id: res.orderId });
    if (res.emailWarning) qs.set("warn", res.emailWarning);
    router.push(`/order/success?${qs.toString()}`);
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_360px]">
      <form onSubmit={onSubmit} className="card p-6 space-y-4">
        <h1 className="text-xl font-semibold">Shipping details</h1>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              required
              value={form.customer_email}
              onChange={(e) => update("customer_email", e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="name">Full name *</label>
            <input
              id="name"
              required
              value={form.customer_name}
              onChange={(e) => update("customer_name", e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="address">Address *</label>
          <input
            id="address"
            required
            value={form.shipping_address}
            onChange={(e) => update("shipping_address", e.target.value)}
            className="input"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="postcode">Postcode *</label>
            <input
              id="postcode"
              required
              value={form.shipping_postcode}
              onChange={(e) => update("shipping_postcode", e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="country">Country *</label>
            <input
              id="country"
              required
              value={form.shipping_country}
              onChange={(e) => update("shipping_country", e.target.value)}
              className="input"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={submitting} className="btn-primary w-full">
          {submitting ? "Placing order..." : `Place order — ${formatPrice(total_cents)}`}
        </button>
        <p className="text-xs text-gray-500">
          This is a demo. No real payment is taken.
        </p>
      </form>

      <aside className="card h-fit p-5">
        <h2 className="font-semibold">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((it) => (
            <li key={it.product_id} className="flex justify-between">
              <span className="text-gray-600">
                {it.name} <span className="text-gray-400">× {it.quantity}</span>
              </span>
              <span>{formatPrice(it.unit_price_cents * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-gray-200 pt-3 font-semibold">
          <span>Total</span>
          <span>{formatPrice(total_cents)}</span>
        </div>
      </aside>
    </div>
  );
}