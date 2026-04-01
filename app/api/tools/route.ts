import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tools } from '@/lib/db/schema';
import { z } from 'zod';

const submitToolSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(500),
  websiteUrl: z.string().url(),
  categoryId: z.string().uuid(),
  pricingModel: z.enum(['free', 'freemium', 'paid', 'open_source']),
  hasFreeTier: z.boolean().default(false),
  hasOpenSource: z.boolean().default(false),
  hasApi: z.boolean().default(false),
  techStack: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = submitToolSchema.parse(body);
    
    // Check if slug already exists
    const existingTool = await db.query.tools.findFirst({
      where: (tools, { eq }) => eq(tools.slug, validatedData.slug),
    });
    
    if (existingTool) {
      return NextResponse.json(
        { error: 'Tool with this slug already exists' },
        { status: 409 }
      );
    }
    
    // Insert tool
    const [newTool] = await db.insert(tools).values({
      ...validatedData,
      status: 'pending',
      affiliateEnabled: false,
    }).returning();
    
    return NextResponse.json({
      success: true,
      tool: newTool,
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error submitting tool:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
