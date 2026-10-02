import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "MediCare Pharmacy — Premium Vitamins & Supplements",
  description: "Your trusted online pharmacy for vitamins, supplements, and wellness products. Free shipping on orders over $50.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let email: string | null = null;
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? null;
  } catch {
    // env not set yet — render without auth
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Navbar email={email} />
          <main className="mx-auto w-full max-w-7xl px-4 py-8 flex-1">{children}</main>
          <footer className="border-t border-blue-100 bg-gradient-to-r from-blue-50 to-green-50 py-8 mt-12">
            <div className="mx-auto max-w-7xl px-4">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">MediCare</h3>
                  <p className="text-sm text-gray-600">Your trusted online pharmacy for health and wellness.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Shop</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-blue-600">Vitamins</a></li>
                    <li><a href="#" className="hover:text-blue-600">Supplements</a></li>
                    <li><a href="#" className="hover:text-blue-600">Wellness</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-blue-600">Contact Us</a></li>
                    <li><a href="#" className="hover:text-blue-600">Shipping Info</a></li>
                    <li><a href="#" className="hover:text-blue-600">Returns</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Connect</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-blue-600">Facebook</a></li>
                    <li><a href="#" className="hover:text-blue-600">Twitter</a></li>
                    <li><a href="#" className="hover:text-blue-600">Instagram</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-blue-200 pt-6 text-center text-sm text-gray-600">
                <p>© 2024 MediCare Pharmacy. All rights reserved. Licensed Pharmacy #12345</p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
