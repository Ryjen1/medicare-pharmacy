# shop.

A demo online shop built with **Next.js 14 (App Router)**, **Supabase** (DB + Google OAuth),
**Mailgun** (order confirmation emails), and deployable to **Vercel**.

## Features

- Product listings, product detail pages, persistent cart (localStorage)
- Checkout flow that writes to Supabase (orders, order_items)
- Order confirmation emails via Mailgun
- Google OAuth via Supabase + Google Cloud Console

## Quick start

```bash
cp .env.example .env.local
# fill in real values
npm install
npm run dev
```

Then visit `http://localhost:3000`.

## Setup guide

### 1. Supabase

1. Create a project at https://supabase.com.
2. In the **SQL Editor**, paste and run `supabase/schema.sql`. This creates the
   `products`, `orders`, and `order_items` tables, sets up RLS, and inserts seed data.
3. In **Project Settings → API**, copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only, never expose)

### 2. Google OAuth via Google Cloud + Supabase

1. Go to https://console.cloud.google.com.
2. Create a project (or reuse an existing one).
3. **APIs & Services → OAuth consent screen** — pick "External", fill in name + support email.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**
   - Authorized redirect URIs:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
     (also `http://localhost:54321/auth/v1/callback` for local dev)
5. Copy the **Client ID** and **Client Secret**.
6. In Supabase: **Authentication → Providers → Google** — enable it, paste Client ID + Secret,
   and save. Optionally restrict the provider to specific emails.
7. **Authentication → URL Configuration** — add your site URL (e.g. `http://localhost:3000`
   for dev and your Vercel URL for prod) to the redirect allow list.

### 3. Mailgun

1. Sign up at https://www.mailgun.com and add a sending domain (or use the sandbox).
2. Copy the **API key** from the dashboard.
3. Put them in `.env.local`:
   ```
   MAILGUN_API_KEY=key-xxxx
   MAILGUN_DOMAIN=mg.yourdomain.com
   MAILGUN_FROM="shop. <orders@mg.yourdomain.com>"
   ```

### 4. Deploy to Vercel

```bash
git init && git add . && git commit -m "Initial commit"
vercel
```

In the Vercel project settings, add the same env values (use your production site URL for
`NEXT_PUBLIC_SITE_URL`, e.g. `https://shop.vercel.app`).

Then add the Vercel callback to:
- Supabase **Authentication → URL Configuration** as a redirect URL
- Google Cloud Console **OAuth client → Authorized redirect URIs** (only if you change the OAuth flow)

## Project structure

```
app/
  actions/placeOrder.ts     Server action: validates, inserts order, sends email
  auth/callback/route.ts   OAuth code exchange
  cart/page.tsx            Cart view
  checkout/page.tsx        Checkout form
  order/success/page.tsx   Order confirmation
  products/[id]/page.tsx   Product detail
  login/page.tsx           Google OAuth sign-in
  layout.tsx               Loads user from Supabase
  page.tsx                 Shop home
components/                CartProvider, Navbar, GoogleSignInButton, etc.
lib/
  supabase/                Browser, server, and admin Supabase clients
  types.ts                 Shared TS types
  mailgun.ts               Email send helper
  format.ts                Money formatting
supabase/schema.sql        Tables, RLS, seed data
```

## Notes

- Cart is in `localStorage` (no auth required to add items).
- Stock is decremented when an order is placed.
- The `service_role` key is used **only server-side** to insert orders and decrement
  stock — never expose it to the browser.
- Payment is **not** taken in this demo — wire in Stripe or another gateway in `placeOrder`
  before going live.