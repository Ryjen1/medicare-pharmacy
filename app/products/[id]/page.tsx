import Image from "next/image";
import { notFound } from "next/navigation";
import { mockProducts } from "@/lib/mockData";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/lib/types";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find(p => p.id === params.id);

  if (!product) return notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-green-50 shadow-xl">
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
          <div className="absolute top-4 right-4 rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
            In Stock ({product.stock} available)
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Premium Quality
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-6">{formatPrice(product.price_cents)}</p>
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-green-50 p-6 mb-6 border-2 border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2">Product Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span>100% authentic guarantee</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Fast delivery within 2-3 business days</span>
            </div>
          </div>

          <div className="mt-auto">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
