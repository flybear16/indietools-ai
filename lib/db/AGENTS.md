# lib/db/ — Database Layer

## OVERVIEW

Drizzle ORM + PostgreSQL: schema, queries, migrations.

## STRUCTURE

```
lib/db/
├── index.ts         # Drizzle instance + postgres clients
├── schema.ts        # Tables, enums, relations, type exports
├── queries.ts       # Query functions (findMany, findFirst)
└── migrations/      # Auto-generated SQL (don't edit)
    ├── 0000_*.sql
    └── meta/
```

## WHERE TO LOOK

| Task | File |
|------|------|
| Add new table | `schema.ts` — define table + relations + types |
| Add new query | `queries.ts` — use drizzle query builder |
| Run migrations | `pnpm db:push` (dev) or `pnpm db:migrate` (prod) |
| Seed data | `scripts/seed.ts` → reads from `content/tools/*.json` |
| DB connection | `index.ts` — exports `db` instance |

## CONVENTIONS

- **All IDs are UUIDs** — `uuid().primaryKey().defaultRandom()`
- **Relations defined separately** from table definitions
- **Types exported from schema.ts** — `Category`, `Tool`, `User`, `Review`, `New*` variants
- **Queries use `with`** for relations (not manual joins)
- **No raw SQL** — all queries use Drizzle query builder
- **`orderBy: desc(tools.createdAt)`** for listing queries
- **`prepare: false`** on query client for compatibility

## ANTI-PATTERNS

- Don't edit migration files manually — always use `drizzle-kit generate`
- Don't use raw SQL — use Drizzle query builder
- Don't forget to export types from schema.ts
- Don't use `limit` without `orderBy`
- Don't create separate DB connections — use the singleton from `index.ts`
