# IndieTools.ai

> AI tools directory for indie developers - curated collection of AI-powered tools to help solo developers build, launch, and grow.

## 🎯 Project Overview

**IndieTools.ai** is a curated directory of AI tools specifically designed for independent developers and solo founders. Unlike general AI tool directories, we focus on the complete workflow from ideation to monetization.

### Key Features

- 🛠️ **6-Phase Workflow**: Tools organized by development stage (Ideation → Building → Design → Launch → Growth → Monetization)
- ⭐ **Curated Selection**: Only tools that have been verified for indie developer use cases
- 💰 **Affiliate Integration**: Transparent affiliate links to support the project
- 📝 **Real Reviews**: Community-driven reviews and use case sharing
- 🔍 **Smart Search**: Find tools by tech stack, pricing, integrations

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Database | PostgreSQL (Supabase) |
| Cache | Redis (Upstash) |
| Search | Algolia / Meilisearch |
| Auth | NextAuth.js |
| Payment | Stripe |
| Deploy | Vercel |

## 📁 Project Structure

```
indietools-ai/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Marketing pages
│   │   ├── page.tsx        # Landing page
│   │   ├── about/
│   │   └── pricing/
│   ├── (tools)/            # Tool pages
│   │   ├── tools/
│   │   ├── categories/
│   │   └── [slug]/
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── tools/              # Tool-related components
│   └── marketing/          # Marketing components
├── lib/                    # Utility functions
│   ├── db/                 # Database utilities
│   ├── auth/               # Auth configuration
│   └── utils/              # Helper functions
├── types/                  # TypeScript types
├── public/                 # Static assets
├── content/                # Markdown content
│   ├── tools/              # Tool descriptions
│   └── blog/               # Blog posts
├── scripts/                # Build scripts
└── tests/                  # Test files
```

## 🛠️ Development

### Prerequisites

- Node.js 20+
- pnpm (recommended)
- PostgreSQL (or Supabase account)

### Setup

```bash
# Clone the repository
git clone https://github.com/flybear16/indietools-ai.git
cd indietools-ai

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Setup database
pnpm db:push

# Run development server
pnpm dev
```

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# Stripe
STRIPE_PUBLISHABLE_KEY="..."
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."

# Algolia (optional)
ALGOLIA_APP_ID="..."
ALGOLIA_API_KEY="..."
```

## 📊 Roadmap

### Phase 1: MVP (Week 1-4)
- [ ] Landing page with hero and search
- [ ] Tool listing and detail pages
- [ ] 6-phase category system
- [ ] Basic search functionality
- [ ] Tool submission form
- [ ] Email subscription
- [ ] 50 curated tools

### Phase 2: Growth (Week 5-8)
- [ ] User reviews and ratings
- [ ] Advanced filtering
- [ ] Tool comparison
- [ ] Weekly newsletter
- [ ] Content marketing (blog)
- [ ] SEO optimization

### Phase 3: Monetization (Week 9-12)
- [ ] Affiliate link tracking
- [ ] Pro membership (Stripe)
- [ ] Sponsored listings
- [ ] API access
- [ ] Analytics dashboard

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [Indie Hackers](https://indiehackers.com) community for inspiration
- All the amazing indie developers building in public

---

Built with ❤️ by indie developers, for indie developers.
