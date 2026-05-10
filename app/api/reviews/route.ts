import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reviews, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const reviewSchema = z.object({
  toolId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  name: z.string().max(255).optional(),
  reviewText: z.string().max(2000).optional(),
  useCase: z.string().max(255).optional(),
  wouldRecommend: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = reviewSchema.parse(body);

    // Find or create user by name (anonymous if no name)
    let userId: string;
    if (validated.name) {
      // Try to find existing user with this name
      let user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.name, validated.name as string),
      });
      if (!user) {
        // Create anonymous user
        const email = `anonymous-${Date.now()}@indietools.ai`;
        [user] = await db.insert(users).values({
          name: validated.name,
          email,
        }).returning();
      }
      userId = user.id;
    } else {
      // Use or create a default anonymous user
      let user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, 'anonymous@indietools.ai'),
      });
      if (!user) {
        [user] = await db.insert(users).values({
          name: 'Anonymous',
          email: 'anonymous@indietools.ai',
        }).returning();
      }
      userId = user.id;
    }

    const [review] = await db.insert(reviews).values({
      toolId: validated.toolId,
      userId,
      rating: validated.rating,
      reviewText: validated.reviewText,
      useCase: validated.useCase,
      wouldRecommend: validated.wouldRecommend,
    }).returning();

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
