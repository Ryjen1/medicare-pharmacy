"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    add({
      product_id: product.id,
      name: product.name,
      unit_price_cents: product.price_cents,
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={added}
      className={`w-full rounded-xl px-6 py-4 text-lg font-bold shadow-lg transition-all duration-300 ${
        added
          ? "bg-green-500 text-white"
          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:-translate-y-0.5"
      }`}
    >
      {added ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Added to Cart!
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </span>
      )}
    </button>
  );
}
