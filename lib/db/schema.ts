import { pgTable, uuid, varchar, text, boolean, timestamp, decimal, integer, pgEnum } from 'drizzle-orm/pg-core';

export const pricingModelEnum = pgEnum('pricing_model', ['free', 'freemium', 'paid', 'open_source']);
export const toolStatusEnum = pgEnum('tool_status', ['pending', 'approved', 'rejected']);
export const userRoleEnum = pgEnum('user_role', ['user', 'pro', 'team', 'admin']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'inactive', 'cancelled']);

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  phase: varchar('phase', { length: 50 }).notNull(), // ideation, building, design, launch, growth, monetization
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

export type Category = typeof categories.$inferSelect;
export type Tool = typeof tools.$inferSelect;
export type User = typeof users.$inferSelect;
export type Review = typeof reviews.$inferSelect;

export type NewCategory = typeof categories.$inferInsert;
export type NewTool = typeof tools.$inferInsert;
export type NewUser = typeof users.$inferInsert;
export type NewReview = typeof reviews.$inferInsert;
