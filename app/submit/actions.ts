'use server';

import { db } from '@/lib/db';
import { tools } from '@/lib/db/schema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const submitToolSchema = z.object({
  name: z.string().min(2, 'Tool name must be at least 2 characters'),
  websiteUrl: z.string().url('Please enter a valid URL'),
  categoryId: z.string().uuid('Please select a category'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  pricingModel: z.enum(['free', 'freemium', 'paid', 'open_source']),
  email: z.string().email('Please enter a valid email'),
});

export type SubmitToolInput = z.infer<typeof submitToolSchema>;

export async function submitTool(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      websiteUrl: formData.get('websiteUrl') as string,
      categoryId: formData.get('categoryId') as string,
      description: formData.get('description') as string,
      pricingModel: formData.get('pricingModel') as string,
      email: formData.get('email') as string,
    };

    // Validate input
    const validated = submitToolSchema.parse(data);

    // Generate slug from name
    const slug = validated.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Insert into database
    await db.insert(tools).values({
      name: validated.name,
      slug: `${slug}-${Date.now()}`, // Add timestamp to avoid conflicts
      description: validated.description,
      websiteUrl: validated.websiteUrl,
      categoryId: validated.categoryId,
      pricingModel: validated.pricingModel,
      hasFreeTier: validated.pricingModel === 'free' || validated.pricingModel === 'freemium',
      hasOpenSource: validated.pricingModel === 'open_source',
      status: 'pending',
      submittedBy: validated.email,
    });

    // Revalidate the tools page
    revalidatePath('/tools');

    return { success: true, message: 'Tool submitted successfully!' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: error.errors.map(e => e.message).join(', ') 
      };
    }
    console.error('Submit tool error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}
