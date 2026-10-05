-- Cart items table (for cross-device cart sync)
-- Run this in the Supabase SQL Editor

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  name text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  image_url text not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create index if not exists cart_items_user_id_idx on public.cart_items(user_id);

alter table public.cart_items enable row level security;

drop policy if exists "users read own cart" on public.cart_items;
create policy "users read own cart"
  on public.cart_items for select using (auth.uid() = user_id);

drop policy if exists "users insert own cart" on public.cart_items;
create policy "users insert own cart"
  on public.cart_items for insert with check (auth.uid() = user_id);

drop policy if exists "users update own cart" on public.cart_items;
create policy "users update own cart"
  on public.cart_items for update using (auth.uid() = user_id);

drop policy if exists "users delete own cart" on public.cart_items;
create policy "users delete own cart"
  on public.cart_items for delete using (auth.uid() = user_id);

drop trigger if exists cart_items_set_updated_at on public.cart_items;
create trigger cart_items_set_updated_at
  before update on public.cart_items
  for each row execute function public.set_updated_at();
