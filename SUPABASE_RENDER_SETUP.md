# Supabase + Render Setup Guide

This file shows the easiest path for local setup and deploy, with exactly what to copy from Supabase and where to paste it.

## What I need from you

From Supabase, give me the following values (replace secrets with placeholders if you want to keep them private):

1. `DATABASE_URL` (pooler connection string)
   - Example format:
     ```
     postgresql://postgres.<project-ref>:YOUR_PASSWORD@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
2. `DIRECT_URL` (optional, session-mode string for migrations)
   - Example format:
     ```
     postgresql://postgres.<project-ref>:YOUR_PASSWORD@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
     ```
3. `NEXT_PUBLIC_SUPABASE_URL`
   - Example: `https://<project-ref>.supabase.co`
4. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Example: `sb_publishable_...`
5. `SUPABASE_SERVICE_ROLE_KEY`
   - This must start with `service_role_...`
6. `JWT_SECRET`
   - Any long random string, e.g. `a4f8...`

> If your password includes `@`, `%`, or spaces, replace them with URL-encoded values, e.g. `@` → `%40`.

## Where to find these values

### Supabase project dashboard
- Project URL and keys: **Project → Settings → API**
- Database connection strings: **Project → Settings → Database**
- The app is already using `bvkfqbkntmfyciwebwrn.supabase.co` as the project URL.

## Where to put them locally

In the repo folder:

`Aurexia-SaaS-COO-Edits\Aurexia-SaaS-COO-Edits\.env`

Use this exact structure:

```env
DATABASE_URL="postgresql://postgres.<project-ref>:YOUR_PASSWORD@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.<project-ref>:YOUR_PASSWORD@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
SUPABASE_SERVICE_ROLE_KEY="service_role_..."
JWT_SECRET="replace-with-a-strong-random-string"
```

## Local commands to run

From the nested project folder:

```powershell
cd .\Aurexia-SaaS-COO-Edits
npm install
npm run check:env
npx prisma generate
npm run seed
npm run dev
```

If the seed step fails due to your local network, use the Supabase SQL Editor instead.

## How I can help you now

- If you paste the masked values here, I can update `.env` for you and rerun `npm run seed`.
- If you want, I can give you the exact Render env list to copy/paste into Render.

## Deploy to Render

Use the same env values in Render:

- `DATABASE_URL`
- `DIRECT_URL` (optional)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`

Build command: `npm install && npm run build`
Start command: `npm start`

After deploy, check:

`https://<your-render-app>.onrender.com/api/health`
