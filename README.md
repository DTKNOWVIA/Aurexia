# AUREXIA — Infrastructure & Project README

> **Institutional Capital Platform for Critical Mineral Investment in Southern Africa**
> This document covers everything a new team member needs to understand the infrastructure, what has been set up, what still needs to be done, and how to access all services.

---

## TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Infrastructure Checklist — What Is Done](#infrastructure-checklist--what-is-done)
3. [Services Used](#services-used)
4. [Environment Variables](#environment-variables)
5. [Repository Structure](#repository-structure)
6. [Database](#database)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [What Still Needs To Be Done](#what-still-needs-to-be-done)
9. [Team Access](#team-access)
10. [Important Rules](#important-rules)

---

## PROJECT OVERVIEW

Aurexia is a vertically integrated institutional platform for originating, structuring, managing, and exiting critical mineral investments across Southern Africa.

The platform is a 4-layer digital ecosystem:

| Layer | Purpose | URL |
|-------|---------|-----|
| Public Website | LP attraction + deal origination | aurexia.com |
| Investor Microsite | NDA-gated fundraising conversion | investors.aurexia.com |
| Private Platform (Core SaaS) | Full operating system | platform.aurexia.com |
| LP Portal | Post-investment reporting | portal.aurexia.com |

**Three-person engineering team:**

| Role | Responsibility |
|------|---------------|
| DevOps | Infrastructure, CI/CD, security, deployments |
| Backend | API routes, business logic, database, RBAC |
| Frontend | All UI — website, microsite, SaaS platform, LP portal |

---

## INFRASTRUCTURE CHECKLIST — WHAT IS DONE

### DevOps — Completed

- [x] Next.js project created (`create-next-app`)
- [x] GitHub repository created — `Aurexia-SaaS`
- [x] Code pushed to GitHub (`main` branch)
- [x] Supabase project created — `Aurexia` (free tier)
- [x] PostgreSQL database live on Supabase
- [x] All 10 database tables created via SQL Editor
- [x] Prisma ORM installed and configured (v7)
- [x] Prisma schema complete — all models defined
- [x] Prisma Client generated
- [x] Upstash Redis database created (free tier)
- [x] Supabase Storage bucket created — `aurexia-documents`
- [x] Vercel project connected to GitHub repo
- [x] All environment variables added to Vercel
- [x] All environment variables added to GitHub Secrets
- [x] CI/CD pipeline created — `.github/workflows/ci.yml`
- [x] GitHub Actions running — lint → typecheck → build
- [x] Node.js version set to 20 in CI pipeline
- [x] Automatic deploys on push to `main`

### Still To Do — DevOps

- [ ] Set up separate `aurexia-backend` repo
- [ ] Deploy backend to Railway (free tier)
- [ ] Set up Cloudflare DNS — connect domain to Vercel
- [ ] Configure subdomains (investors, platform, portal)
- [ ] Add Prisma migration step to CI pipeline
- [ ] Set up Sentry error monitoring
- [ ] Security hardening — WAF, rate limiting
- [ ] Add staging environment
- [ ] Backup and disaster recovery plan
- [ ] Add team members to Supabase

---

## SERVICES USED

All services below are on **free tiers**. No credit card required.

| Service | Purpose | URL | Account |
|---------|---------|-----|---------|
| **Supabase** | PostgreSQL database + file storage | supabase.com | MrRosstheGoat's Org |
| **Upstash** | Redis (sessions + caching) | upstash.com | — |
| **Vercel** | Frontend hosting + deployments | vercel.com | Connected to GitHub |
| **GitHub** | Code repository + CI/CD | github.com/MrRosstheGoat/Aurexia-SaaS | MrRosstheGoat |
| **Railway** | Backend API hosting | railway.app | — (not yet set up) |
| **Cloudflare** | DNS + CDN + SSL | cloudflare.com | — (not yet set up) |

---

## ENVIRONMENT VARIABLES

These variables are required for the project to run. They are stored in:
- **Vercel** — for production deployments
- **GitHub Secrets** — for CI/CD pipeline
- **`.env` file** — for local development only (never commit this file)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zeaoxgjwdtoopsmmweot.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_kbj7OzSU0RvxzpbMi53iQA_wGrXOo5N
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database
DATABASE_URL=your_supabase_connection_string_here

# Redis
UPSTASH_REDIS_REST_URL=your_upstash_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_token_here

# Auth
JWT_SECRET=your_64_character_random_string_here
```

> **IMPORTANT:** `NEXT_PUBLIC_` variables are safe to expose in the browser. All others are secret — never share them publicly or commit them to GitHub.

---

## REPOSITORY STRUCTURE

```
aurexia/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── prisma/
│   ├── schema.prisma           # Database models
│   └── migrations/             # Database migrations
├── prisma.config.ts            # Prisma configuration
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   └── lib/                    # Shared utilities
├── .env                        # Local environment variables (DO NOT COMMIT)
├── .env.example                # Template for environment variables
├── package.json
└── README.md
```

---

## DATABASE

**Provider:** Supabase (PostgreSQL)
**Project ID:** `zeaoxgjwdtoopsmmweot`
**Project URL:** `https://zeaoxgjwdtoopsmmweot.supabase.co`
**Region:** Africa (South Africa)

### Tables Created

| Table | Purpose |
|-------|---------|
| `User` | Platform users — all roles |
| `Investor` | LP / investor records and CRM |
| `Asset` | Mine assets and pipeline |
| `Document` | Uploaded files linked to assets or investors |
| `ICMemo` | Investment Committee memos |
| `Comment` | Comments on assets and memos |
| `Task` | Tasks assigned to users per asset |
| `Notification` | User notifications |
| `AccessLog` | Audit trail — every action logged |
| `Report` | Generated reports (IC, LP quarterly) |

### Backend MVP Setup

The backend MVP is configured and can be bootstrapped locally once the database connection is available.

1. Copy `.env.example` to `.env`
2. Set `DATABASE_URL` to your PostgreSQL connection string
3. Set `JWT_SECRET` to a secure random string
4. Optional: configure Supabase storage credentials if documents will be uploaded

```bash
# Generate Prisma Client
npx prisma generate

# Seed initial demo data
npm run seed
```

> If `DATABASE_URL` is missing, `npm run seed` will fail with `DATABASE_URL is required to run the seed script.`

### Running Migrations Locally

> **Note:** Direct database connections (port 5432/6543) may be blocked by some ISPs in Zimbabwe. Use the Supabase SQL Editor to run migrations directly if local connection fails.

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

---

## CI/CD PIPELINE

**File:** `.github/workflows/ci.yml`

The pipeline runs automatically on every push to `main` and every pull request.

```
Push to GitHub
     ↓
GitHub Actions triggers
     ↓
Install dependencies (npm install)
     ↓
Run lint (npm run lint)
     ↓
Type check (npx tsc --noEmit)
     ↓
Build (npm run build)
     ↓
Vercel auto-deploys to production
```

**Preview deployments:** Every branch automatically gets a preview URL from Vercel.

**Production deploy:** Automatic on merge to `main`.

---

## WHAT STILL NEEDS TO BE DONE

### Backend Developer — Start Here

1. Create repo `aurexia-backend` on GitHub
2. Set up Express/Node.js server
3. Connect to Supabase database using `DATABASE_URL`
4. Implement authentication — login, MFA, logout
5. Implement RBAC middleware for all 11 user roles
6. Build API routes — see `Aurexia_Production_Saas_Blueprint.docx` for full API surface
7. Deploy to Railway

**Key API routes to build first:**
```
POST /auth/login
POST /auth/logout
GET  /investors
POST /investors
GET  /assets
POST /assets
POST /assets/:id/score
```

### Frontend Developer — Start Here

1. Set up design system — brand tokens, typography, components
2. Build public website — homepage, strategy, map, contact forms
3. Build authentication screens — login, MFA
4. Build LP CRM dashboard
5. Build deal pipeline views
6. Connect to backend API

**Brand colors:**
```
Deep Black:     #0A0A0A
Lithium Blue:   #2F80ED
Copper Bronze:  #C47A2C
Emerald:        #27AE60
Off White:      #F7F7F5
```

**Font:** Inter

### DevOps — Remaining Tasks

1. Set up `aurexia-backend` repo and Railway deployment
2. Configure Cloudflare DNS and subdomains
3. Add Sentry error monitoring
4. Security hardening once APIs are live
5. Add staging environment

---

## TEAM ACCESS

### How To Get Access

**GitHub:**
- Ask DevOps to add you as a collaborator on `Aurexia-SaaS` repo
- Go to: github.com/MrRosstheGoat/Aurexia-SaaS

**Supabase:**
- Ask DevOps to invite your email via Organization → Team
- You will receive an email invitation
- Role: Developer (Backend) or Read Only (Frontend)

**Vercel:**
- Ask DevOps to add you to the Vercel team
- You will receive an email invitation

**Environment Variables:**
- Copy the `.env.example` file and fill in your values
- Ask DevOps for the secret values privately — never over public channels

---

## IMPORTANT RULES

```
1. NEVER commit .env files to GitHub
2. NEVER share SUPABASE_SERVICE_ROLE_KEY or DATABASE_URL publicly
3. NEVER push directly to main — use feature branches and pull requests
4. ALWAYS run npm run lint before pushing
5. ALL database changes go through Prisma schema first
6. ALWAYS create a pull request for review before merging
```

### Branch Strategy

```
main          → production (auto-deploys to Vercel)
dev           → staging (for testing before production)
feature/xxx   → individual features (gets preview URL)
fix/xxx       → bug fixes
```

---

*Last updated: May 2026 — DevOps: Gareth (MrRosstheGoat)*