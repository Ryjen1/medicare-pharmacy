# MediCare Pharmacy

A modern online pharmacy built with **Next.js 14 (App Router)**, **Supabase** (DB + email/password auth), **Resend** (order confirmation emails via Mailgun-compatible env vars), and deployed on **Vercel**.

## Features

- Pharmacy product listings with categories and hero section
- Product detail pages with trust badges
- Persistent shopping cart (localStorage)
- Checkout flow that writes to Supabase (orders, order_items)
- Order confirmation emails via Resend (configured as MAILGUN_API_KEY)
- Email/password authentication via Supabase
- Google OAuth support (optional)
- Beautiful, responsive UI with Tailwind CSS

## Quick Start

```bash
cp .env.example .env.local
# fill in real values from Supabase and Resend
npm install
npm run dev
```

Then visit `http://localhost:3000`.

## Setup Guide

See [SETUP.md](./SETUP.md) for detailed instructions on:
- Supabase project setup and database schema
- Email/password authentication configuration
- Resend SMTP setup for auth emails
- Google OAuth (optional)
- Mailgun/Resend email configuration
- Vercel deployment

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Use Resend API key here (MAILGUN_API_KEY accepts re_... keys)
MAILGUN_API_KEY=re_your-resend-key
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_FROM="MediCare <onboarding@resend.dev>"

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import to Vercel: https://vercel.com/new
3. Add all environment variables from `.env.local`
4. Deploy!

See [SETUP.md](./SETUP.md#deploy-to-vercel) for detailed deployment instructions.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Email**: Resend (via MAILGUN_API_KEY env var)
- **Deployment**: Vercel

## License

MIT
