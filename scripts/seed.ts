import { db } from '@/lib/db';
import { categories, tools } from '@/lib/db/schema';
import initialData from '@/content/tools/initial-tools.json';

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

  // Insert tools
  console.log('Inserting tools...');
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
      categoryId: categoryId,
      pricingModel: tool.pricingModel as 'free' | 'freemium' | 'paid' | 'open_source',
      startingPrice: tool.startingPrice ? tool.startingPrice.toString() : null,
      hasFreeTier: tool.hasFreeTier,
      hasOpenSource: tool.hasOpenSource,
      hasApi: tool.hasApi,
      techStack: tool.techStack,
      status: tool.status as 'pending' | 'approved' | 'rejected',
      affiliateEnabled: tool.affiliateEnabled || false,
    }).onConflictDoNothing();
  }

  console.log('✅ Seeding complete!');
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
