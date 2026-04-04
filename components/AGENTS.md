# components/ — React Components

## OVERVIEW

Shared React components: tool cards, search inputs, loading states.

## STRUCTURE

```
components/
├── tool-card.tsx        # Tool listing card (client component)
├── tools-loading.tsx    # Loading skeleton for tools grid
├── home-search.tsx      # Homepage search bar (client component)
├── search-input.tsx     # Tools page search with URL sync
├── tools/               # EMPTY — future tool-related components
├── marketing/           # EMPTY — future marketing components
└── ui/                  # EMPTY — future shadcn/ui components
```

## WHERE TO LOOK

| Task | File |
|------|------|
| Tool card UI | `tool-card.tsx` — card layout, pricing badge, logo |
| Search on homepage | `home-search.tsx` — form → router.push to /tools |
| Search on tools page | `search-input.tsx` — URL param sync |
| Loading states | `tools-loading.tsx` — skeleton placeholder |
| Add shadcn/ui component | Place in `ui/` subdirectory |

## CONVENTIONS

- **`'use client'`** — Components with state/events must be client components
- **`cn()` utility** — Use `cn()` from `lib/utils.ts` for class merging
- **Tailwind classes** — Inline styles, no separate CSS modules
- **Lucide icons** — Use `lucide-react` for all icons (no SVG inline)
- **Props interface** — Define inline or at top of file (not separate types file)

## ANTI-PATTERNS

- Don't put server-side data fetching in components — pass data as props
- Don't use `'use client'` on components that don't need it
- Don't create separate CSS files — use Tailwind classes
- Don't import from `lib/db` directly — pass data from page components
- Don't use inline SVGs — use lucide-react icons
