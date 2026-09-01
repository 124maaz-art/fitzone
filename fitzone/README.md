# FitZone Gym Website & Booking Management System

A production-ready, dark-themed, full-stack gym website with a complete booking and content management system. Built with Next.js (App Router), TypeScript, Tailwind CSS v4, PostgreSQL + Prisma, and NextAuth (admin auth).

## Features

### Public Website
- **Home** — hero, stats, services, equipment, memberships, trainers, testimonials, transformations, CTA
- **About**, **Programs**, **Transformations**, **Testimonials**, **Gallery** (filterable + lightbox)
- **Equipment** — searchable, filterable by category with shareable URL params, detail pages
- **Services** & **Packages** — pricing and detail pages
- **Trainers** — profile pages
- **Booking** — multi-step booking flow with live trainer availability and double-booking prevention (transaction-based slot check)
- **Contact** — inquiry form + contact info
- **Legal** — Privacy Policy, Terms of Service

### Admin Panel (`/admin`, role-protected)
- Dashboard with stats, recent bookings and inquiries
- Full CRUD for: equipment, categories, services, packages, trainers (+ weekly availability), programs, gallery, transformations, testimonials, inquiries
- Booking management (search, filter, status change, view, delete)
- Site settings (contact info, hero content, social links)

## Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL, Prisma ORM 7 (driver adapters via `@prisma/adapter-pg`)
- **Auth:** NextAuth v5 (credentials) with bcrypt password hashing
- **Forms:** react-hook-form + zod
- **UI:** lucide-react, framer-motion, react-hot-toast
- **Images:** Cloudinary (unsigned upload) with URL fallback

## Getting Started

### Prerequisites
- Node.js 18+ (24 recommended)
- A PostgreSQL database (local or [Neon](https://neon.tech) / Supabase / Vercel Postgres)
- Optional Cloudinary account for image uploads

### 1. Install
```bash
npm install
```

### 2. Environment variables
Copy `.env.example` to `.env` and fill in your values.

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Long random string for NextAuth (generate with `openssl rand -base64 32`) |
| `AUTH_URL` | Deployment URL, e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (unsigned upload) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin credentials |

`CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` are reserved for signed uploads; the app currently uses unsigned uploads so only the `NEXT_PUBLIC_*` vars are required for image uploads.

### 3. Set up the database
```bash
npm run db:migrate   # apply the initial migration
npm run db:seed      # seed admin user + demo content
```

Use `npm run db:push` instead of `db:migrate` if you prefer schema-sync without migration files, or `npm run db:deploy` for production (applies existing migrations only).

### 4. Run the app
```bash
npm run dev
```
Open http://localhost:3000.

## Admin Access
Navigate to `/admin/login` and sign in with the seeded `ADMIN_EMAIL` / `ADMIN_PASSWORD` credentials.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the project on Vercel (framework: Next.js — auto-detected).
3. Set all `.env` variables listed above in the Vercel project settings.
4. Provision a PostgreSQL database (Vercel Postgres / Neon / Supabase) and set `DATABASE_URL`.
5. Run migrations and seed once the database is reachable:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

> **Note:** The Prisma 7 schema configuration lives in `prisma.config.ts` (the `DATABASE_URL` is sourced from the environment, and the datasource block in the schema has no URL). No code changes are needed for deployment.

## Project Structure
```
prisma/               # schema, config, migration, seed
src/app/              # App Router (public + admin route groups, API routes)
src/components/       # UI primitives, layout, public sections, admin managers
src/lib/              # prisma, auth, data, actions, validations, utils
public/images/        # placeholder SVGs (replace with real gym photos)
```

## License
Private project.
