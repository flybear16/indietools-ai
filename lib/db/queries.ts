import { db } from './index';
import { tools, categories, useCases, useCaseTools, newsletterSubscriptions } from './schema';
import { eq, desc } from 'drizzle-orm';

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
