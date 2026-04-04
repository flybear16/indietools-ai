# app/ Directory — Next.js App Router

## OVERVIEW

Next.js 15 App Router: pages, API routes, server actions, and UI logic.

## STRUCTURE

```
app/
├── about/page.tsx           # Static about page
├── api/tools/route.ts       # POST API (Zod validated)
├── submit/
│   ├── page.tsx             # Submission page (server component)
│   ├── submit-form.tsx      # Form UI (client component)
│   └── actions.ts           # Server actions
├── tools/
│   ├── page.tsx             # Tool listing + filters
│   └── [slug]/page.tsx      # Tool detail (dynamic route)
├── layout.tsx               # Root layout (Inter font)
├── page.tsx                 # Homepage (featured tools)
└── sitemap.ts               # SEO sitemap generation
```

## WHERE TO LOOK

| Task | File |
|------|------|
| Add new page | `app/{name}/page.tsx` |
| API mutation | `app/api/{resource}/route.ts` |
| Form submission | `app/{feature}/actions.ts` + `submit-form.tsx` |
| Dynamic metadata | `{slug}/page.tsx` → `generateMetadata()` |
| Tool listing filters | `app/tools/page.tsx` (inline logic) |

## CONVENTIONS (Deviations from root)

- **Server components default** — add `'use client'` only when needed (forms, state)
- **`searchParams` is `Promise<{}>`** in Next.js 15 — always `await` before use
- **Server actions** in separate `actions.ts` files (not inline)
- **Metadata** via `generateMetadata` for dynamic pages (not static `metadata` export)
- **Navigation header duplicated** across pages — not extracted to component
- **Filter logic inline** in page — not extracted to hooks/utils

## ANTI-PATTERNS

- Don't use `'use client'` on pages that don't need interactivity
- Don't forget to `await searchParams` (Next.js 15 breaking change)
- Don't put form logic in server components — use `actions.ts` + client component
- Don't extract navigation header (keep pages self-contained for now)
