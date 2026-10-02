# MediCare Pharmacy - Setup Guide

This guide will help you set up all the required services for the MediCare Pharmacy application.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Required Services

### 1. Supabase (Database & Authentication)

**Get your Supabase credentials:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Sign up or log in with GitHub
3. Click **"New Project"**
4. Fill in project details:
   - **Name**: MediCare Pharmacy (or your preferred name)
   - **Database Password**: Create a secure password
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is sufficient
5. Wait for project to initialize (2-3 minutes)
6. Once ready, go to **Project Settings** → **API**
7. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

**Set up the database schema:**

1. In your Supabase project, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the schema from `supabase/schema.sql` (if it exists)
4. Click **"Run"** to execute

### 2. Email & Password Authentication (Primary)

The app uses **email/password authentication** by default. No additional setup needed — Supabase handles this automatically.

**Enable Email Auth in Supabase:**

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Make sure **Email** is enabled (it's enabled by default)
4. Under **Email Auth**, ensure "Enable Email provider" is checked
5. Save changes

**Configure Resend SMTP for Confirmation Emails:**

By default, Supabase sends auth emails using its own mailer. To use Resend instead:

1. Go to [Resend](https://resend.com) and sign up (free, no card needed)
2. Get your API key from [resend.com/api-keys](https://resend.com/api-keys) (starts with `re_...`)
3. In Supabase Dashboard, go to **Project Settings** → **Auth** → **SMTP Settings**
4. Toggle **"Enable Custom SMTP"** to ON
5. Enter these values:
   - **Sender Email**: `onboarding@resend.dev` (for testing) or your verified domain
   - **Sender Name**: `MediCare Pharmacy`
   - **Host**: `smtp.resend.com`
   - **Port**: `465`
   - **Username**: `resend`
   - **Password**: Your Resend API key (starts with `re_...`)
6. Click **"Save"**

Now all auth emails (signup confirmation, password reset, etc.) will be sent via Resend!

**Optional: Disable Email Confirmation for Testing:**

If you want to skip email confirmation during development:
1. Go to **Project Settings** → **Auth** → **Providers** → **Email**
2. Toggle **"Enable Email Confirmations"** to OFF
3. Users can sign in immediately after signup without confirming email

**Test Email Confirmation:**

1. Go to your app at http://localhost:3000
2. Click "Sign in" → "Sign up"
3. Register with your email
4. Check your inbox for a confirmation email from Resend
5. Click the link to confirm your account

### 3. Google OAuth (Optional)

Google OAuth is available but requires [Google Cloud Console](https://console.cloud.google.com/) setup (credit card may be required).

**Set up Google OAuth (optional):**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" and enable it
4. Configure OAuth consent screen:
   - Go to **APIs & Services** → **OAuth consent screen**
   - Choose **External** user type
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`
   - Add test users (your email for testing)
5. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **"Create Credentials"** → **"OAuth client ID"**
   - Application type: **Web application**
   - Name: MediCare Pharmacy
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/auth/callback`
   - Click **"Create"**
6. Copy the **Client ID** and **Client Secret**

**Configure in Supabase:**

1. Go back to Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **"Enable"**
4. Paste your Google **Client ID** and **Client Secret**
5. Save changes

**Note:** If Google OAuth is not configured, the "Continue with Google" button will show an error. Use email/password instead.

### 3. Mailgun (Email Notifications) — or Resend Alternative

The env variable names use `MAILGUN_*` for task compatibility, but the app is configured to work with **[Resend](https://resend.com)** out of the box (no credit card required).

#### Option A: Resend (Recommended — No Credit Card)

1. Go to [Resend](https://resend.com) and sign up (free, no card needed)
2. Verify your email address
3. Go to [API Keys](https://resend.com/api-keys) and click **"Create API Key"**
4. Copy the key (starts with `re_...`)
5. Paste it into `MAILGUN_API_KEY` in your `.env.local`
6. For testing, use the default from address: `onboarding@resend.dev` (already set in `.env.local`)

**Free tier:** 100 emails/day, 3,000/month — perfect for development.

#### Option B: Mailgun (Original)

1. Go to [Mailgun](https://www.mailgun.com/)
2. Sign up (requires credit card for verification)
3. Verify your domain or use Mailgun's sandbox domain
4. Go to **API Keys** section and copy your **API Key** (starts with `key-...`)
5. Get your domain from the **Domains** section

### 4. Environment Variables Setup

Create a `.env.local` file in the root of the `shop` directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Service Role (server-side only, never expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Mailgun Configuration (works with Resend API key too!)
MAILGUN_API_KEY=re_your-resend-api-key-or-key-mailgun-key
MAILGUN_DOMAIN=mg.yourdomain.com  # Not used by Resend, kept for compatibility
MAILGUN_FROM="MediCare <onboarding@resend.dev>"  # Use your verified domain for production

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important Security Notes:**
- Never commit `.env.local` to version control
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security - keep it secret!
- Only use `NEXT_PUBLIC_*` variables on the client side
- `MAILGUN_API_KEY` accepts both Mailgun keys (`key-...`) and Resend keys (`re_...`)

## Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

If you haven't set up the database yet, create these tables in Supabase SQL Editor:

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_postcode TEXT NOT NULL,
  shipping_country TEXT NOT NULL,
  total_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  quantity INTEGER NOT NULL
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Testing the Application

### Test Mode (Without Backend)

The app currently runs with **mock data**, so you can:
- Browse products on the home page
- View product details
- Add items to cart
- See the cart page

### Full Mode (With Backend)

After setting up all credentials:

1. **Test Authentication:**
   - Click "Sign in" button
   - Use Google OAuth to sign in
   - Verify you're logged in (avatar appears in navbar)

2. **Test Products:**
   - Add real products to the `products` table in Supabase
   - Refresh the home page to see them

3. **Test Orders:**
   - Add items to cart
   - Go to checkout
   - Fill in shipping details
   - Place order
   - Check email for confirmation (if Mailgun is configured)

## Troubleshooting

### Supabase Connection Error
- Verify your URL and keys in `.env.local`
- Check that your Supabase project is active
- Ensure you've run the database schema

### Google OAuth Not Working
- Verify redirect URI matches exactly: `http://localhost:3000/auth/callback`
- Check that Google provider is enabled in Supabase
- Ensure your email is in the test users list (for external apps)

### Images Not Loading
- Check that `next.config.js` includes the image domains
- Verify image URLs are accessible
- For Unsplash, use the format: `https://images.unsplash.com/photo-ID?w=400&h=300&fit=crop`

### Email Not Sending
- Verify your API key in `MAILGUN_API_KEY` (Resend: starts with `re_`, Mailgun: starts with `key-`)
- If using Resend, make sure `MAILGUN_FROM` uses a verified domain or `onboarding@resend.dev` for testing
- Check the Resend dashboard at [resend.com/emails](https://resend.com/emails) for delivery logs
- For Mailgun, check that recipient emails are authorized (for sandbox domains)

## Quick Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Resend Dashboard](https://resend.com) — Recommended for email (no credit card)
- [Mailgun Dashboard](https://app.mailgun.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For issues or questions:
- Check the [Supabase Docs](https://supabase.com/docs)
- Check the [Next.js Docs](https://nextjs.org/docs)
- Review the code comments in the repository

---

**Ready to build?** Start the dev server and visit [http://localhost:3000](http://localhost:3000) 🚀
