import type { Product } from "./types";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Vitamin D3 5000 IU",
    description: "High-potency vitamin D3 for immune support and bone health. 120 softgels.",
    price_cents: 2499,
    image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    stock: 45,
    created_at: "2024-01-15T00:00:00Z"
  },
  {
    id: "2",
    name: "Omega-3 Fish Oil",
    description: "Premium fish oil with EPA & DHA for heart and brain health. 90 capsules.",
    price_cents: 3299,
    image_url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop",
    stock: 38,
    created_at: "2024-01-16T00:00:00Z"
  },
  {
    id: "3",
    name: "Probiotic 50 Billion CFU",
    description: "Advanced probiotic blend with 16 strains for digestive health. 30 capsules.",
    price_cents: 3999,
    image_url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop",
    stock: 52,
    created_at: "2024-01-17T00:00:00Z"
  },
  {
    id: "4",
    name: "Zinc 50mg",
    description: "Essential mineral for immune function and wound healing. 100 tablets.",
    price_cents: 1499,
    image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    stock: 67,
    created_at: "2024-01-18T00:00:00Z"
  },
  {
    id: "5",
    name: "Magnesium Glycinate",
    description: "Highly absorbable magnesium for muscle relaxation and sleep. 120 capsules.",
    price_cents: 2799,
    image_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
    stock: 41,
    created_at: "2024-01-19T00:00:00Z"
  },
  {
    id: "6",
    name: "Vitamin C 1000mg",
    description: "Powerful antioxidant with rose hips for enhanced absorption. 180 tablets.",
    price_cents: 1999,
    image_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
    stock: 89,
    created_at: "2024-01-20T00:00:00Z"
  }
];
