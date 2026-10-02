"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, update, remove, total_cents, count } = useCart();

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-12 text-center shadow-xl">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 mb-6">
            <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Find something nice for your health and wellness journey.</p>
          <Link href="/" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">{count} {count === 1 ? 'item' : 'items'} in your cart</p>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.product_id} className="card flex items-center gap-4 p-6 hover:shadow-lg transition-shadow">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-green-50">
                <Image src={it.image_url} alt={it.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 mb-1">{it.name}</p>
                <p className="text-sm text-blue-600 font-semibold">{formatPrice(it.unit_price_cents)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="h-10 w-10 rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all font-bold"
                  onClick={() => update(it.product_id, it.quantity - 1)}
                >
                  −
                </button>
                <span className="w-10 text-center font-bold text-lg">{it.quantity}</span>
                <button
                  className="h-10 w-10 rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all font-bold"
                  onClick={() => update(it.product_id, it.quantity + 1)}
                >
                  +
                </button>
              </div>
              <p className="w-24 text-right font-bold text-lg text-gray-900">
                {formatPrice(it.unit_price_cents * it.quantity)}
              </p>
              <button
                onClick={() => remove(it.product_id)}
                className="text-gray-400 hover:text-red-600 transition-colors p-2"
                aria-label="Remove item"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <aside className="card h-fit p-6 shadow-xl sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
          <dl className="space-y-4 text-sm mb-6">
            <div className="flex justify-between">
              <dt className="text-gray-600">Subtotal</dt>
              <dd className="font-semibold">{formatPrice(total_cents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Shipping</dt>
              <dd className="font-semibold text-green-600">
                {total_cents >= 5000 ? 'FREE' : 'Calculated at checkout'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Tax</dt>
              <dd className="font-semibold">Calculated at checkout</dd>
            </div>
            <div className="border-t-2 border-gray-200 pt-4">
              <div className="flex justify-between text-lg">
                <dt className="font-bold text-gray-900">Total</dt>
                <dd className="font-bold text-blue-600">{formatPrice(total_cents)}</dd>
              </div>
            </div>
          </dl>
          
          {total_cents < 5000 && (
            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-green-50 p-4 mb-6 border border-blue-100">
              <p className="text-xs text-gray-700">
                <span className="font-bold">Add {formatPrice(5000 - total_cents)} more</span> for free shipping!
              </p>
              <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-green-500 transition-all"
                  style={{ width: `${Math.min((total_cents / 5000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <Link href="/checkout" className="btn-primary w-full">
            Proceed to Checkout
          </Link>
          
          <Link href="/" className="block text-center mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
