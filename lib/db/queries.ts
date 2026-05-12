import { db } from './index';
import { tools, categories, useCases, useCaseTools, newsletterSubscriptions, reviews, posts, favorites } from './schema';
import { eq, desc, asc, avg, count, sql, and, isNotNull } from 'drizzle-orm';

export async function getAllTools() {
  return db.query.tools.findMany({
    with: {
      category: true,
    },
    orderBy: desc(tools.createdAt),
  });
}

export async function getToolBySlug(slug: string) {
  return db.query.tools.findFirst({
    where: eq(tools.slug, slug),
    with: {
      category: true,
    },
  });
}

export async function getAllCategories() {
  return db.query.categories.findMany({
    orderBy: categories.sortOrder,
  });
}

export async function getToolsByCategory(categorySlug: string) {
  return db.query.tools.findMany({
    where: eq(categories.slug, categorySlug),
    with: {
      category: true,
    },
    orderBy: desc(tools.createdAt),
  });
}

export async function getFeaturedTools(limit = 8) {
  return db.query.tools.findMany({
    with: {
      category: true,
    },
    limit,
    orderBy: desc(tools.createdAt),
  });
}

export async function getAllUseCases() {
  return db.query.useCases.findMany({
    orderBy: useCases.sortOrder,
  });
}

export async function getUseCaseBySlug(slug: string) {
  return db.query.useCases.findFirst({
    where: eq(useCases.slug, slug),
    with: {
      useCaseTools: {
        orderBy: useCaseTools.sortOrder,
        with: {
          tool: {
            with: {
              category: true,
            },
          },
        },
      },
    },
  });
}

export async function getUseCasesWithTools() {
  return db.query.useCases.findMany({
    orderBy: useCases.sortOrder,
    with: {
      useCaseTools: {
        orderBy: useCaseTools.sortOrder,
        with: {
          tool: {
            with: {
              category: true,
            },
          },
        },
      },
    },
  });
}

// Newsletter subscription
export async function subscribeEmail(email: string, source: 'homepage' | 'submit_page' | 'footer' = 'homepage') {
  return db.insert(newsletterSubscriptions).values({
    email,
    source,
  }).onConflictDoNothing().returning();
}

export async function unsubscribeEmail(email: string) {
  return db.update(newsletterSubscriptions)
    .set({ isActive: false, unsubscribedAt: new Date() })
    .where(eq(newsletterSubscriptions.email, email));
}

export async function getSubscriptionByEmail(email: string) {
  return db.query.newsletterSubscriptions.findFirst({
    where: eq(newsletterSubscriptions.email, email),
  });
}

// Reviews
export async function getToolReviews(toid: string) {
  return db.query.reviews.findMany({
    where: eq(reviews.toolId, toid),
    with: {
      user: true,
    },
    orderBy: desc(reviews.createdAt),
  });
}

export async function getToolReviewStats(toid: string) {
  const result = await db.select({
    average: avg(reviews.rating),
    count: count(reviews.id),
  }).from(reviews).where(eq(reviews.toolId, toid));
  return {
    average: result[0]?.average ? Number(result[0].average) : 0,
    count: Number(result[0]?.count ?? 0),
  };
}

export async function createReview(data: {
  toolId: string;
  userId: string;
  rating: number;
  reviewText?: string;
  useCase?: string;
  wouldRecommend?: boolean;
}) {
  return db.insert(reviews).values(data).returning();
}

export async function getToolsWithStats() {
  const allTools = await db.query.tools.findMany({
    with: { category: true },
    orderBy: desc(tools.createdAt),
  });


  // Fetch review stats for all tools in one query
  const statsRows = await db
    .select({
      toolId: reviews.toolId,
      average: avg(reviews.rating),
      count: count(reviews.id),
    })
    .from(reviews)
    .groupBy(reviews.toolId);


  const statsMap = new Map(statsRows.map((r) => [r.toolId, {
    average: r.average ? Number(r.average) : 0,
    count: Number(r.count ?? 0),
  }]));


  return allTools.map((tool) => ({
    ...tool,
    reviewStats: statsMap.get(tool.id) ?? { average: 0, count: 0 },
  }));
}

// Blog Posts
export async function getPublishedPosts() {
  return db.query.posts.findMany({
    where: and(eq(posts.isPublished, true), isNotNull(posts.publishedAt)),
    with: { author: true },
    orderBy: desc(posts.publishedAt),
  });
}

export async function getPostBySlug(slug: string) {
  return db.query.posts.findFirst({
    where: and(eq(posts.slug, slug), eq(posts.isPublished, true)),
    with: { author: true },
  });
}

// Favorites
export async function getUserFavorites(userId: string) {
  return db.query.favorites.findMany({
    where: eq(favorites.userId, userId),
    with: {
      tool: {
        with: {
          category: true,
        },
      },
    },
    orderBy: desc(favorites.createdAt),
  });
}

export async function addFavorite(userId: string, toolId: string) {
  return db.insert(favorites).values({ userId, toolId }).onConflictDoNothing().returning();
}

export async function removeFavorite(userId: string, toolId: string) {
  return db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.toolId, toolId)));
}

export async function isFavorite(userId: string, toolId: string) {
  const result = await db.query.favorites.findFirst({
    where: and(eq(favorites.userId, userId), eq(favorites.toolId, toolId)),
  });
  return !!result;
}

export async function getUserFavoriteToolIds(userId: string) {
  const userFavorites = await db.query.favorites.findMany({
    where: eq(favorites.userId, userId),
    columns: { toolId: true },
  });
  return userFavorites.map((f) => f.toolId);
}
