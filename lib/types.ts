export type Product = {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  image_url: string;
  stock: number;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string | null;
  customer_email: string;
  customer_name: string;
  shipping_address: string;
  shipping_postcode: string;
  shipping_country: string;
  total_cents: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
};

export type CartItem = {
  product_id: string;
  name: string;
  unit_price_cents: number;
  image_url: string;
  quantity: number;
};