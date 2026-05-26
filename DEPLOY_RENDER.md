# Deploying Aurexia on Render with Supabase

This document walks through connecting your Supabase project and deploying this Next.js + Prisma app to Render.

1) Prepare Supabase
- Create a Supabase project (DTKNOWVIA's Project)
- In Supabase: Settings → Database → copy the **Connection string** (use the default Direct connection or the Pooler URL if your network needs IPv4)
- In Supabase: Settings → API → copy the **Project URL**, **anon (publishable)** key and **service_role** key

2) Add environment variables (local)
- Copy `.env.example` to `.env` or create `.env.local` and set:

```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.YOUR_PROJECT.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://<your-project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_..."
SUPABASE_SERVICE_ROLE_KEY="service_role_..."
JWT_SECRET="a-very-strong-random-string"
```

If you must use IPv4-only networking, use the pooler URL instead:

```
DATABASE_URL="postgresql://postgres:[PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"
```

3) Local verification

Run these commands from the repository root:

```bash
npm install
npx prisma generate
npm run seed
npm run dev
```

If `npm run seed` fails due to network blocks, use the Supabase SQL Editor to insert demo data (see `supabase-seed-notes.sql` for examples).

4) Deploy to Render

- Create a new **Web Service** on Render and connect your GitHub repo (or push manually).
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Set the environment variables in Render's dashboard (same names as above). Do NOT commit `.env` to Git.
- Make sure the Render service can reach Supabase (choose the same region if latency matters).

5) Health check and testing

- The app exposes a health endpoint: `GET /api/health` which reports basic env checks.
- After deployment, visit `https://<your-render-app>.onrender.com/api/health` to confirm `DATABASE_URL` is set and reachable.

6) Render configuration

- This repo includes a `render.yaml` file for Render service configuration.
- If you use Render's GitHub-connected deploy flow, it can help keep build/start settings consistent.

7) Notes on storage

- This project uses Supabase Storage for document uploads. Keep `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` configured if you want file uploads to work.

If you want, I can walk through each step with you and help paste the secrets into Render.
