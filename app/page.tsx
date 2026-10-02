import Link from "next/link";
import Image from "next/image";
import { mockProducts } from "@/lib/mockData";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function HomePage() {
  const products = mockProducts;

  const categories = [
    { name: "Vitamins", icon: "💊", color: "from-blue-500 to-blue-600" },
    { name: "Supplements", icon: "🧪", color: "from-green-500 to-green-600" },
    { name: "Health", icon: "❤️", color: "from-red-500 to-red-600" },
    { name: "Wellness", icon: "🌿", color: "from-purple-500 to-purple-600" },
  ];

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white mb-4">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            Trusted by 50,000+ customers
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Your Health, <br />
            <span className="text-green-300">Our Priority</span>
          </h1>
          <p className="text-lg text-blue-100 mb-6 leading-relaxed">
            Premium vitamins, supplements, and wellness products from trusted brands. 
            Free shipping on orders over $50.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="#products" className="btn-primary bg-white !text-blue-600 hover:bg-blue-50">
              Shop Now
            </Link>
            <button className="btn-outline border-white text-white hover:bg-white/10">
              Learn More
            </button>
          </div>
        </div>
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-green-400/20 blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href="/"
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-white/90 transition-colors mt-1">
                  View all
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="products">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600 mt-1">Top-rated supplements for your wellness journey</p>
          </div>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View all →
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p: Product) => (
            <li key={p.id} className="group card overflow-hidden hover:-translate-y-1 transition-all duration-300">
              <Link href={`/products/${p.id}`} className="block">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-blue-50 to-green-50">
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    In Stock
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {p.name}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatPrice(p.price_cents)}
                    </p>
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-md">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 p-8 md:p-12 border-2 border-green-100">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-3xl mb-4 shadow-lg">
              🚚
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders over $50</p>
          </div>
          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white text-3xl mb-4 shadow-lg">
              ✓
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Quality Guaranteed</h3>
            <p className="text-sm text-gray-600">100% authentic products</p>
          </div>
          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white text-3xl mb-4 shadow-lg">
              💬
            </div>
            <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-sm text-gray-600">Expert pharmacists available</p>
          </div>
        </div>
      </section>
    </div>
  );
}
