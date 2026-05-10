import Link from 'next/link';
import { db } from '@/lib/db';
import { tools, reviews, newsletterSubscriptions, clicks, categories } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { BarChart3, Star, Users, MousePointerClick, TrendingUp, Zap } from 'lucide-react';

export const metadata = {
  title: 'Analytics - IndieTools.ai',
  description: 'Site analytics and statistics for IndieTools.ai',
};

async function getStats() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toolCountResult: any[] = await db.execute(sql`SELECT count(*) as count FROM tools`);
  const reviewCountResult: any[] = await db.execute(sql`SELECT count(*) as count FROM reviews`);
  const avgRatingResult: any[] = await db.execute(sql`SELECT coalesce(avg(rating), 0) as avg_rating FROM reviews`);
  const clickCountResult: any[] = await db.execute(sql`SELECT count(*) as count FROM clicks`);
  const categoryCountResult: any[] = await db.execute(sql`SELECT count(*) as count FROM categories`);
  const subscriberCountResult: any[] = await db.execute(sql`SELECT count(*) as count FROM newsletter_subscriptions WHERE is_active = true`);
  const topToolsRaw: any[] = await db.execute(sql`
    SELECT t.id, t.name, t.slug,
           (SELECT avg(r.rating) FROM reviews r WHERE r.tool_id = t.id) as avg_rating,
           (SELECT count(*) FROM reviews r WHERE r.tool_id = t.id) as review_count
    FROM tools t
    ORDER BY avg_rating DESC NULLS LAST
    LIMIT 10
  `);
  const reviewsPerToolRaw: any[] = await db.execute(sql`
    SELECT tm.name as tool_name, tm.slug as tool_slug, count(r.id) as count
    FROM reviews r
    LEFT JOIN tools tm ON r.tool_id = tm.id
    GROUP BY tm.name, tm.slug
    ORDER BY count DESC
    LIMIT 10
  `);
  const categoryDistRaw: any[] = await db.execute(sql`
    SELECT c.name as category_name, count(t.id) as count
    FROM tools t
    LEFT JOIN categories c ON t.category_id = c.id
    GROUP BY c.name
    ORDER BY count DESC
  `);
  const recentReviewsRaw: any[] = await db.execute(sql`
    SELECT r.id, r.rating, r.review_text, t.name as tool_name, t.slug as tool_slug, r.created_at
    FROM reviews r
    LEFT JOIN tools t ON r.tool_id = t.id
    ORDER BY r.created_at DESC
    LIMIT 5
  `);

  return {
    toolCount: toolCountResult[0]?.count ?? 0,
    reviewCount: reviewCountResult[0]?.count ?? 0,
    avgRating: Number(avgRatingResult[0]?.avg_rating ?? 0),
    clickCount: clickCountResult[0]?.count ?? 0,
    categoryCount: categoryCountResult[0]?.count ?? 0,
    subscriberCount: subscriberCountResult[0]?.count ?? 0,
    topTools: topToolsRaw,
    reviewsPerTool: reviewsPerToolRaw,
    categoryDist: categoryDistRaw,
    recentReviews: recentReviewsRaw,
  };
}

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-md bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export default async function AnalyticsPage() {
  const stats = await getStats();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">IndieTools.ai</Link>
          <nav className="flex flex-1 items-center justify-end gap-4">
            <Link href="/tools" className="text-sm font-medium hover:text-primary">Tools</Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary">Blog</Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">About</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Site statistics and insights</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard icon={Zap} label="Total Tools" value={stats.toolCount} sub={`${stats.categoryCount} categories`} />
          <StatCard icon={Star} label="Reviews" value={stats.reviewCount} sub={stats.avgRating > 0 ? `Avg ${stats.avgRating.toFixed(1)} ★` : 'No ratings yet'} />
          <StatCard icon={Users} label="Newsletter" value={stats.subscriberCount} sub="Active subscribers" />
          <StatCard icon={MousePointerClick} label="Affiliate Clicks" value={stats.clickCount} sub="Total tracked clicks" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Top Tools by Rating */}
          <div className="rounded-lg border">
            <div className="border-b px-6 py-4">
              <h2 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Top Rated Tools
              </h2>
            </div>
            <div className="divide-y">
              {stats.topTools.length === 0 ? (
                <p className="px-6 py-4 text-sm text-muted-foreground">No reviews yet</p>
              ) : stats.topTools.map((tool: any) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium">{tool.name}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{tool.avg_rating ? Number(tool.avg_rating).toFixed(1) : '-'}</span>
                    <span className="text-xs text-muted-foreground">({tool.review_count})</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Most Reviewed */}
          <div className="rounded-lg border">
            <div className="border-b px-6 py-4">
              <h2 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Most Reviewed
              </h2>
            </div>
            <div className="divide-y">
              {stats.reviewsPerTool.length === 0 ? (
                <p className="px-6 py-4 text-sm text-muted-foreground">No reviews yet</p>
              ) : stats.reviewsPerTool.map((item: any, i: number) => (
                <Link
                  key={i}
                  href={`/tools/${item.tool_slug}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium">{item.tool_name ?? 'Unknown'}</span>
                  <span className="text-sm text-muted-foreground">{item.count} reviews</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="rounded-lg border">
            <div className="border-b px-6 py-4">
              <h2 className="font-semibold">Tools by Category</h2>
            </div>
            <div className="divide-y">
              {stats.categoryDist.map((cat: any, i: number) => (
                <div key={i} className="flex items-center justify-between px-6 py-3">
                  <span className="text-sm">{cat.category_name ?? 'Uncategorized'}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(100, (Number(cat.count) / stats.toolCount) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-6 text-right">{cat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="rounded-lg border">
            <div className="border-b px-6 py-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                Recent Reviews
              </h2>
            </div>
            <div className="divide-y">
              {stats.recentReviews.length === 0 ? (
                <p className="px-6 py-4 text-sm text-muted-foreground">No reviews yet</p>
              ) : stats.recentReviews.map((review: any) => (
                <Link
                  key={review.id}
                  href={`/tools/${review.tool_slug}`}
                  className="block px-6 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{review.tool_name ?? 'Unknown'}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-3 w-3 ${n <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.review_text && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{review.review_text}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row lg:px-8">
          <span className="font-semibold">IndieTools.ai</span>
          <p className="text-sm text-muted-foreground">Built for indie developers</p>
        </div>
      </footer>
    </div>
  );
}
