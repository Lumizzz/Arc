# 🚀 Deployment Guide — Supabase + Vercel

Step-by-step instructions to go from zero to production.

---

## Prerequisites

- Node.js 18+ installed locally
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (free tier works)
- Git repository (GitHub / GitLab / Bitbucket)

---

## Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a name, set a strong **database password** (save it!), pick a region
3. Wait ~2 minutes for provisioning

### Get your connection strings

In your Supabase project:

```
Settings → Database → Connection string
```

You need **two** URLs:

| Variable | Tab | Port | Use |
|----------|-----|------|-----|
| `DATABASE_URL` | **Transaction** pooler | `6543` | Runtime queries (app) |
| `DIRECT_URL` | **Session** pooler or Direct | `5432` | Migrations only |

Copy the `URI` format for each. They look like:
```
postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:[port]/postgres
```

**Important:** Append these params to `DATABASE_URL` only:
```
?pgbouncer=true&connection_limit=1
```

Final `DATABASE_URL` example:
```
postgresql://postgres.abcxyz:mypassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

---

## Step 2 — Local Setup & Migration

```bash
# 1. Clone / enter the project
cd imagica-app

# 2. Install dependencies
npm install

# 3. Copy env file
cp .env.example .env.local
```

Edit `.env.local` and fill in:
```env
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@...supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@...supabase.com:5432/postgres"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

```bash
# 4. Run migration (creates tables in Supabase)
npx prisma migrate deploy

# 5. Seed the database (creates admin user + default content)
npm run db:seed

# 6. Test locally
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — public landing page  
Visit [http://localhost:3000/admin](http://localhost:3000/admin) — CMS dashboard  

Default credentials: `admin@imagica.ai` / `admin123`

---

## Step 3 — Push to Git

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/imagica-app.git
git push -u origin main
```

> ⚠️ Make sure `.gitignore` is present — **never** commit `.env.local`

---

## Step 4 — Deploy to Vercel

### Option A — Vercel Dashboard (recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Framework preset: **Next.js** (auto-detected)
4. **Do NOT click Deploy yet** — first add environment variables

### Add Environment Variables

In Vercel → Project → **Settings → Environment Variables**, add:

| Name | Value | Environments |
|------|-------|-------------|
| `DATABASE_URL` | your pooled URL with `?pgbouncer=true&connection_limit=1` | Production, Preview, Development |
| `DIRECT_URL` | your direct URL (port 5432) | Production, Preview, Development |
| `NEXTAUTH_SECRET` | output of `openssl rand -base64 32` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | Production only |

> For Preview deployments, set `NEXTAUTH_URL` to `https://*.vercel.app` or leave it — NextAuth auto-detects `VERCEL_URL` in preview.

5. Click **Deploy**

Vercel will run:
```
prisma generate && prisma migrate deploy && next build
```
(configured in `vercel.json` → `buildCommand`)

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
# Follow the prompts, then add env vars in the dashboard
```

---

## Step 5 — Change the Default Admin Password

After first deploy, either:

**Option A — Supabase SQL Editor:**
```sql
-- Run this in Supabase → SQL Editor
-- First generate a bcrypt hash: https://bcrypt-generator.com (12 rounds)
UPDATE "User"
SET password = '$2a$12$YOUR_BCRYPT_HASH_HERE'
WHERE email = 'admin@imagica.ai';
```

**Option B — Add a change-password page** (recommended for ongoing use)

---

## Vercel Build Configuration (already set in vercel.json)

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

This ensures:
1. Prisma client is generated fresh for the Vercel runtime
2. Any new migrations are applied before the build
3. Next.js build runs last

---

## Environment Variables Reference

```env
# ── Required ──────────────────────────────────────────────
DATABASE_URL     # Supabase pooler URL (port 6543) + ?pgbouncer=true&connection_limit=1
DIRECT_URL       # Supabase direct URL (port 5432) — migrations only
NEXTAUTH_SECRET  # Random 32-char string (openssl rand -base64 32)
NEXTAUTH_URL     # Your full deployment URL (https://yourapp.vercel.app)
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `P1001: Can't reach database` | Check `DATABASE_URL` — wrong host/password/port |
| `prepared statement already exists` | Ensure `?pgbouncer=true` is in `DATABASE_URL` |
| `NEXTAUTH_URL` mismatch errors | Set it exactly to your Vercel URL, no trailing slash |
| Build fails with `prisma generate` | Ensure `postinstall` script exists in `package.json` |
| Too many connections to Supabase | Add `&connection_limit=1` to `DATABASE_URL` |
| Admin dashboard returns 401 | `NEXTAUTH_SECRET` is missing or mismatched between deploys |

---

## Post-Deployment Checklist

- [ ] Visit the live URL — landing page renders correctly
- [ ] `/admin` redirects to `/admin/login`
- [ ] Login with `admin@imagica.ai` / `admin123` works
- [ ] Edit hero text → click Save → visit public page (refreshes within 60s)
- [ ] Change admin password
- [ ] (Optional) Add a custom domain in Vercel → update `NEXTAUTH_URL`
