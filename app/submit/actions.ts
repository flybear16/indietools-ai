'use server';

import { db } from '@/lib/db';
import { tools } from '@/lib/db/schema';
import { generateSlug } from '@/lib/utils';

export async function submitTool(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const websiteUrl = formData.get('websiteUrl') as string;
    const categoryId = formData.get('categoryId') as string;
    const description = formData.get('description') as string;
    const pricingModel = formData.get('pricingModel') as string;
    const email = formData.get('email') as string;

    // Basic validation
    if (!name || !websiteUrl || !categoryId || !description || !pricingModel) {
      return { success: false, message: 'All fields are required' };
    }

    // Generate slug
    const slug = generateSlug(name);

    // Check if slug already exists
    const existingTool = await db.query.tools.findFirst({
      where: (tools, { eq }) => eq(tools.slug, slug),
    });

    if (existingTool) {
      return { success: false, message: 'A tool with this name already exists' };
    }

    // Insert tool
    await db.insert(tools).values({
      name,
      slug,
      description,
      websiteUrl,
      categoryId,
      pricingModel: pricingModel as 'free' | 'freemium' | 'paid' | 'open_source',
      status: 'pending',
      hasFreeTier: pricingModel === 'free' || pricingModel === 'freemium',
      hasOpenSource: pricingModel === 'open_source',
      hasApi: false,
      affiliateEnabled: false,
    });

    return { success: true, message: 'Tool submitted successfully' };
  } catch (error) {
    console.error('Error submitting tool:', error);
    return { success: false, message: 'Failed to submit tool. Please try again.' };
  }
}
