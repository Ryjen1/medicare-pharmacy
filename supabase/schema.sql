-- Run this in the Supabase SQL editor (https://app.supabase.com -> SQL Editor)

-- 1. Profiles table (for user data)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update timestamp function
create or replace function public.set_updated_at() 
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger for profiles table
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at 
  before update on public.profiles 
  for each row execute function public.set_updated_at();

-- 2. Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price_cents integer not null check (price_cents >= 0),
  image_url text not null,
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

-- 3. Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_email text not null,
  customer_name text not null,
  shipping_address text not null,
  shipping_postcode text not null,
  shipping_country text not null,
  total_cents integer not null check (total_cents >= 0),
  status text not null default 'pending' check (status in ('pending','paid','shipped','cancelled')),
  created_at timestamptz not null default now()
);

-- 4. Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0)
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists orders_user_id_idx on public.orders(user_id);

-- 5. Row Level Security
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles: users can read their own profile
drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile"
  on public.profiles for select using (auth.uid() = id);

-- Profiles: users can update their own profile
drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Products are publicly readable
drop policy if exists "products are publicly readable" on public.products;
create policy "products are publicly readable"
  on public.products for select using (true);

-- Users can read their own orders
drop policy if exists "users read own orders" on public.orders;
create policy "users read own orders"
  on public.orders for select using (auth.uid() = user_id);

-- Users can read their own order items (via order)
drop policy if exists "users read own order items" on public.order_items;
create policy "order items readable via order"
  on public.order_items for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

-- Inserts/updates happen only via the server action using the SERVICE ROLE key
-- so no insert/update policies are defined for anon/authenticated.

-- 6. Seed data - Pharmacy Products
insert into public.products (name, description, price_cents, image_url, stock) values
  ('Vitamin D3 5000 IU', 'High-potency vitamin D3 for immune support and bone health. 120 softgels.', 2499, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800', 45),
  ('Omega-3 Fish Oil', 'Premium fish oil with EPA & DHA for heart and brain health. 90 capsules.', 3299, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800', 38),
  ('Probiotic 50 Billion CFU', 'Advanced probiotic blend with 16 strains for digestive health. 30 capsules.', 3999, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800', 52),
  ('Zinc 50mg', 'Essential mineral for immune function and wound healing. 100 tablets.', 1499, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800', 67),
  ('Magnesium Glycinate', 'Highly absorbable magnesium for muscle relaxation and sleep. 120 capsules.', 2799, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800', 41),
  ('Vitamin C 1000mg', 'Powerful antioxidant with rose hips for enhanced absorption. 180 tablets.', 1999, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800', 89)
on conflict do nothing;
