import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { categories, tools } from '@/lib/db/schema';
import initialData from '@/content/tools/initial-tools.json';
import extraTools from '@/content/tools/extra-tools.json';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');
const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  console.log('🌱 Seeding database...');

  // Insert categories
  console.log('Inserting categories...');
  for (const category of initialData.categories) {
    await db.insert(categories).values({
      name: category.name,
      slug: category.slug,
      description: category.description,
      phase: category.phase,
      icon: category.icon,
      sortOrder: category.sortOrder,
    }).onConflictDoNothing();
  }

  // Get category mappings
  const categoryRows = await db.select().from(categories);
  const categoryMap = new Map(categoryRows.map(c => [c.slug, c.id]));

  // Insert tools from initial data
  console.log('Inserting initial tools...');
  let count = 0;
  for (const tool of initialData.tools) {
    const categoryId = categoryMap.get(tool.categorySlug);
    if (!categoryId) {
      console.warn(`Category not found for tool: ${tool.name}`);
      continue;
    }
    await db.insert(tools).values({
      name: tool.name,
      slug: tool.slug,
      description: tool.description,
      websiteUrl: tool.websiteUrl,
      categoryId,
      pricingModel: tool.pricingModel as any,
      startingPrice: tool.startingPrice ? String(tool.startingPrice) : null,
      hasFreeTier: tool.hasFreeTier ?? false,
      hasOpenSource: tool.hasOpenSource ?? false,
      hasApi: tool.hasApi ?? false,
      techStack: tool.techStack,
      status: tool.status as any,
      affiliateEnabled: (tool as any).affiliateEnabled ?? false,
    }).onConflictDoNothing();
    count++;
  }

  // Insert extra tools
  console.log('Inserting extra tools...');
  for (const tool of extraTools) {
    const categoryId = categoryMap.get(tool.categorySlug);
    if (!categoryId) {
      console.warn(`Category not found for tool: ${tool.name}`);
      continue;
    }
    await db.insert(tools).values({
      name: tool.name,
      slug: tool.slug,
      description: tool.description,
      websiteUrl: tool.websiteUrl,
      categoryId,
      pricingModel: tool.pricingModel as any,
      startingPrice: tool.startingPrice ? String(tool.startingPrice) : null,
      hasFreeTier: tool.hasFreeTier ?? false,
      hasOpenSource: tool.hasOpenSource ?? false,
      hasApi: tool.hasApi ?? false,
      techStack: tool.techStack,
      status: tool.status as any,
      affiliateEnabled: (tool as any).affiliateEnabled ?? false,
    }).onConflictDoNothing();
    count++;
  }

  const finalCount = await db.select({ id: tools.id }).from(tools);
  console.log(`✅ Seeding complete! Total tools in DB: ${finalCount.length}`);
  await client.end();
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
