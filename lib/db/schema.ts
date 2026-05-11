import { pgTable, uuid, varchar, text, boolean, timestamp, decimal, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const pricingModelEnum = pgEnum('pricing_model', ['free', 'freemium', 'paid', 'open_source']);
export const toolStatusEnum = pgEnum('tool_status', ['pending', 'approved', 'rejected']);
export const userRoleEnum = pgEnum('user_role', ['user', 'pro', 'team', 'admin']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'inactive', 'cancelled']);
export const subscriptionSourceEnum = pgEnum('subscription_source', ['homepage', 'submit_page', 'footer']);

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  phase: varchar('phase', { length: 50 }).notNull(),
  icon: varchar('icon', { length: 100 }),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tools = pgTable('tools', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  websiteUrl: varchar('website_url', { length: 500 }),
  logoUrl: varchar('logo_url', { length: 500 }),
  categoryId: uuid('category_id').references(() => categories.id),
  pricingModel: pricingModelEnum('pricing_model').default('freemium'),
  startingPrice: decimal('starting_price', { precision: 10, scale: 2 }),
  hasFreeTier: boolean('has_free_tier').default(false),
  hasOpenSource: boolean('has_open_source').default(false),
  hasApi: boolean('has_api').default(false),
  techStack: text('tech_stack').array(),
  integrations: text('integrations').array(),
  affiliateUrl: varchar('affiliate_url', { length: 500 }),
  affiliateEnabled: boolean('affiliate_enabled').default(false),
  status: toolStatusEnum('status').default('pending'),
  submittedBy: uuid('submitted_by'),
  isFeatured: boolean('is_featured').default(false),
  featuredExpiresAt: timestamp('featured_expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  role: userRoleEnum('role').default('user'),
  subscriptionStatus: subscriptionStatusEnum('subscription_status').default('inactive'),
  subscriptionExpiresAt: timestamp('subscription_expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  source: subscriptionSourceEnum('source').default('homepage'),
  isActive: boolean('is_active').default(true),
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
  unsubscribedAt: timestamp('unsubscribed_at'),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  toolId: uuid('tool_id').references(() => tools.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),
  reviewText: text('review_text'),
  useCase: varchar('use_case', { length: 255 }),
  wouldRecommend: boolean('would_recommend'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const useCases = pgTable('use_cases', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const useCaseTools = pgTable('use_case_tools', {
  id: uuid('id').primaryKey().defaultRandom(),
  useCaseId: uuid('use_case_id').references(() => useCases.id).notNull(),
  toolId: uuid('tool_id').references(() => tools.id).notNull(),
  sortOrder: integer('sort_order').default(0),
  notes: text('notes'),
  isHighlighted: boolean('is_highlighted').default(false),
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImage: varchar('cover_image', { length: 500 }),
  authorId: uuid('author_id').references(() => users.id),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  tags: text('tags').array(),
  isPublished: boolean('is_published').default(false),
});

// Affiliate clicks
export const clicks = pgTable('clicks', {
  id: uuid('id').primaryKey().defaultRandom(),
  toolId: uuid('tool_id').references(() => tools.id).notNull(),
  referrer: varchar('referrer', { length: 500 }),
  userAgent: text('user_agent'),
  country: varchar('country', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// NextAuth required tables
export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: integer('expires_at'),
  tokenType: varchar('token_type', { length: 255 }),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires').notNull(),
});

// Payments/Orders
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  toolId: uuid('tool_id').references(() => tools.id),
  stripeSessionId: varchar('stripe_session_id', { length: 255 }).notNull(),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('usd'),
  planType: varchar('plan_type', { length: 50 }).notNull(), // 'boost' | 'featured'
  status: varchar('status', { length: 50 }).default('pending'), // 'pending' | 'completed' | 'failed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Types
export type Category = typeof categories.$inferSelect;
export type Tool = typeof tools.$inferSelect;
export type User = typeof users.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  tools: many(tools),
}));

export const toolsRelations = relations(tools, ({ one, many }) => ({
  category: one(categories, {
    fields: [tools.categoryId],
    references: [categories.id],
  }),
  reviews: many(reviews),
  clicks: many(clicks),
}));

export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  posts: many(posts),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  tool: one(tools, {
    fields: [reviews.toolId],
    references: [tools.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  tool: one(tools, {
    fields: [payments.toolId],
    references: [tools.id],
  }),
}));

export const clicksRelations = relations(clicks, ({ one }) => ({
  tool: one(tools, {
    fields: [clicks.toolId],
    references: [tools.id],
  }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

export const useCasesRelations = relations(useCases, ({ many }) => ({
  useCaseTools: many(useCaseTools),
}));

export const useCaseToolsRelations = relations(useCaseTools, ({ one }) => ({
  useCase: one(useCases, {
    fields: [useCaseTools.useCaseId],
    references: [useCases.id],
  }),
  tool: one(tools, {
    fields: [useCaseTools.toolId],
    references: [tools.id],
  }),
}));
