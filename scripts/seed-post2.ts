import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { posts } from '@/lib/db/schema';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');
const client = postgres(connectionString);
const db = drizzle(client);

async function seedPosts() {
  console.log('🌱 Seeding second blog post...');

  const blogPosts = [
    {
      title: "Top 10 Free AI Tools for Startups in 2026",
      slug: "top-free-ai-tools-startups-2026",
      excerpt: "Essential free AI tools every startup founder needs in 2026. From code assistants to analytics, these tools won't cost you a dime.",
      content: `Starting a startup is hard. Building one with zero budget is even harder. The good news: there's an AI tool for almost everything today, and many of them have generous free tiers.

Here's my curated list of the top 10 free AI tools that every startup founder should be using in 2026.

## 1. v0.dev - AI Code Assistant
**Free tier:** Included in Vercel hobby tier

v0.dev generates React components from text prompts. It's not about replacing developers—it's about accelerating them. Need a modal? A form? A navigation bar? Describe it, and v0 creates it.

Perfect for: Rapid prototyping, MVP development

## 2. Lovable - No-Code AI Builder
**Free tier:** 5 projects

Lovable lets you build production-ready web applications from simple descriptions. If you're a solo founder who wants to validate ideas quickly, this is your weapon.

Perfect for: Non-technical founders, quick MVPs

## 3. Bolt.new - Browser IDE with AI
**Free tier:** 3 projects

Bolt.new runs entirely in your browser—no setup required. It handles full-stack apps with database connections, API routes, and frontend. The AI assistance helps you code faster without the local environment headache.

Perfect for: Quick experiments, hackathon projects

## 4. Cal.com - Open Source Scheduling
**Free tier:** Unlimited for individuals

Cal.com is the open-source Calendly alternative. Host it yourself or use their free cloud tier. The integrations ecosystem is massive.

Perfect for: Sales calls, user interviews, team scheduling

## 5. Plausible Analytics - Privacy-First Analytics
**Free tier:** 3 months free trial, then $9/month

Plausible is GDPR-compliant, privacy-friendly web analytics. No cookies banners needed. The interface is clean, the data is actionable, and it loads in under a second.

Perfect for: Landing pages, EU-based products

## 6. Crisp - All-in-One Customer Support
**Free tier:** 2 seats, 50 contacts

Crisp combines chat, marketing automation, and helpdesk. The free tier is enough for early-stage startups to offer solid customer support.

Perfect for: Customer support, onboarding flows

## 7. Tally - Free Form Builder
**Free tier:** Unlimited forms, unlimited responses

Tally is the simplest form builder you'll find. No signup, no limits, no distractions. Perfect for user research, beta signups, and feedback collection.

Perfect for: User research, waitlists, feedback

## 8. Linear - Issue Tracking
**Free tier:** 250 issues, unlimited members

Linear is beautiful, fast issue tracking. If you're building a SaaS, Linear keeps your development organized. The keyboard shortcuts alone save hours.

Perfect for: Software teams, agile workflows

## 9. Turso - Edge SQLite Database
**Free tier:** 1 database, 9GB storage, 100GB transfer

Turso gives you SQLite at the edge. libSQL compatible, global replication, and per-query pricing beyond the free tier. For startups, the free tier is remarkably generous.

Perfect for: Edge applications, serverless functions

## 10. Polar - Open Source Payments
**Free tier:** No platform fees on free tier

Polar is Stripe Atlas but open source. If you're in Europe and want to avoid Stripe's fees, Polar is worth exploring. Full billing portal, invoice management, and subscription handling.

Perfect for: European startups, alternative to Stripe

---

## The Free Stack for Bootstrapped Founders

Here's how to build a complete startup infrastructure for $0:

| Need | Tool | Cost |
|------|------|------|
| Code | v0.dev / Bolt.new | Free |
| Forms | Tally | Free |
| Analytics | Plausible | Free (trial) |
| Scheduling | Cal.com | Free |
| Support | Crisp | Free |
| Database | Turso | Free |
| Payments | Polar | Free |
| Issue Tracking | Linear | Free |
| Analytics | PostHog (optional) | Free |

## The Hidden Costs

"Free" always has a catch. Here's what you're trading:

- **Your data:** Some free tools collect usage data. Read the privacy policy.
- **Time:** Free tools often have less documentation and support.
- **Scalability:** You'll eventually outgrow free tiers.

## My Recommendation

Start with the tools above. They're all production-ready and used by real companies. As you grow, you can upgrade to paid tiers—or switch to alternatives.

The key insight: you don't need a huge budget to build a real product. You need the right tools and the determination to ship.

What free AI tools are you using for your startup? Share them at [IndieTools.ai](/submit).`,
      tags: ["free AI tools", "startups", "budget", "SaaS"],
      isPublished: true,
      publishedAt: new Date(),
    }
  ];

  for (const post of blogPosts) {
    try {
      await db.insert(posts).values({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        tags: post.tags,
        isPublished: post.isPublished,
        publishedAt: post.publishedAt,
      }).onConflictDoNothing();
      console.log(`✓ Inserted: ${post.title}`);
    } catch (e: any) {
      console.error(`✗ Failed to insert ${post.title}:`, e.message);
    }
  }

  console.log('✅ Done!');
  await client.end();
}

seedPosts().catch(console.error);
