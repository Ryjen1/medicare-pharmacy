"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import SignOutButton from "./SignOutButton";

export default function Navbar({ email }: { email?: string | null }) {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-30 border-b border-blue-100 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">MediCare</h1>
            <p className="text-xs text-blue-100">Pharmacy & Wellness</p>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-white hover:text-blue-100 transition">
            Shop
          </Link>
          <Link href="/cart" className="relative flex items-center gap-1 text-white hover:text-blue-100 transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart
            {count > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white shadow-md">
                {count}
              </span>
            )}
          </Link>
          {email ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                  {email[0].toUpperCase()}
                </div>
                <span className="text-white">{email.split('@')[0]}</span>
              </div>
              <SignOutButton />
            </div>
          ) : (
            <Link href="/login" className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50 transition shadow-md">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
