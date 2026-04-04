# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-02
**Branch:** main

## OVERVIEW

IndieTools.ai — AI tools directory for indie developers. Next.js 15 (App Router) + TypeScript + PostgreSQL (Drizzle ORM). Curated collection of 51+ AI tools organized by 6 development phases (Ideation → Building → Design → Launch → Growth → Monetization).

## STRUCTURE

```
indietools-ai/
├── app/                     # Next.js App Router
│   ├── api/tools/           # Tool submission API
│   ├── submit/              # Tool submission form + server actions
│   ├── tools/               # Tool listing + detail pages
│   ├── about/               # Static pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── sitemap.ts           # SEO sitemap
├── components/              # React components
│   ├── tool-card.tsx        # Tool listing card
│   ├── home-search.tsx      # Homepage search bar
│   ├── search-input.tsx     # Tools page search
│   └── tools-loading.tsx    # Loading skeleton
├── lib/                     # Library code
│   ├── db/                  # Database layer (see lib/db/AGENTS.md)
│   ├── auth/                # AUTH NOT IMPLEMENTED
│   ├── utils/               # EMPTY — placeholder
│   └── utils.ts             # cn(), formatDate(), generateSlug()
├── types/index.ts           # TypeScript types + constants
├── content/tools/           # Seed data JSON files
├── scripts/seed.ts          # Database seeder
├── docker-compose.yml       # PostgreSQL 16 local dev
└── public/                  # Static assets
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new tool page | `app/tools/[slug]/page.tsx` | Dynamic route with related tools |
| Modify tool listing | `app/tools/page.tsx` | Filter/search logic inline |
| Tool submission | `app/submit/submit-form.tsx` + `actions.ts` | Server actions pattern |
| Database schema | `lib/db/schema.ts` | Drizzle ORM, 4 tables: categories, tools, users, reviews |
| DB queries | `lib/db/queries.ts` | findMany with relations |
| API routes | `app/api/tools/route.ts` | POST only, Zod validation |
| Seed data | `content/tools/initial-tools.json` + `extra-tools.json` | JSON seed files |
| Type definitions | `types/index.ts` | PHASES, PRICING_MODELS constants |

## CODE MAP

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| tools | table | lib/db/schema.ts:20 | Main entity |
| categories | table | lib/db/schema.ts:9 | Tool categories by phase |
| users | table | lib/db/schema.ts:43 | User accounts |
| reviews | table | lib/db/schema.ts:54 | Tool reviews |
| db | export | lib/db/index.ts:16 | Drizzle instance |
| getAllTools() | fn | lib/db/queries.ts:5 | Fetch all with category |
| getToolBySlug() | fn | lib/db/queries.ts:14 | Fetch single by slug |
| PHASES | const | types/index.ts:88 | 6-phase workflow definition |
| ToolCard | component | components/tool-card.tsx:25 | Tool listing card |
| SubmitToolForm | component | app/submit/submit-form.tsx:13 | Submission form |

## CONVENTIONS (Deviations Only)

- **TypeScript**: Strict mode, `@/*` path alias, bundler module resolution
- **Next.js 15**: App Router, server components default, `searchParams` as `Promise`
- **Styling**: Tailwind CSS v3.4 + shadcn/ui conventions, `cn()` utility for class merging
- **DB**: Drizzle ORM with PostgreSQL, migrations in `lib/db/migrations/`
- **Forms**: Server actions pattern (not API routes for mutations)
- **Validation**: Zod schemas for API input

## ANTI-PATTERNS (THIS PROJECT)

- **No tests** — README mentions `tests/` but directory doesn't exist
- **Empty directories** — `lib/auth/`, `lib/utils/` are placeholders
- **Hardcoded credentials** — docker-compose.yml has plaintext POSTGRES_PASSWORD
- **No CI/CD** — No GitHub Actions workflows
- **No restart policy** — docker-compose lacks restart strategy

## UNIQUE STYLES

- **6-phase workflow**: Tools categorized by development stage
- **Chinese commit messages**: Developer uses Chinese in git commits
- **Affiliate integration**: Tools support affiliate URLs
- **Seed-based data**: Content comes from JSON files, not CMS

## COMMANDS

```bash
# Development
pnpm dev              # Dev server on port 3206
pnpm build            # Production build
pnpm start            # Production server

# Database
pnpm db:push          # Push schema to DB
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed from content/tools/*.json
pnpm db:studio        # Drizzle Studio (DB admin)

# Quality
pnpm lint             # ESLint
pnpm typecheck        # TypeScript check
```

## NOTES

- **Node.js 20+** required (engines field in package.json)
- **Port 3206** for dev server (non-standard, not 3000)
- **Auth not implemented** — lib/auth/ is empty, NextAuth is in dependencies but not configured
- **No Stripe integration** — in dependencies but not implemented
- **51 tools** seeded from JSON, status defaults to 'pending'
