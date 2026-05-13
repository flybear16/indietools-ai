import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tools, users } from '@/lib/db/schema';
import { getAllTools, getToolBySlug, getToolReviewStats } from '@/lib/db/queries';
import { sendToolSubmitNotification } from '@/lib/email';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

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
  submitterEmail: z.string().email().optional(), // Optional for logged-in users
  userId: z.string().uuid().optional(), // Logged-in user ID
});

// GET /api/tools - all tools
// GET /api/tools?slug=xxx - single tool by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      const toolsData = await getAllTools();
      const toolsWithStats = await Promise.all(
        toolsData.map(async (tool) => {
          const stats = await getToolReviewStats(tool.id);
          return { ...tool, reviewStats: stats };
        })
      );
      return NextResponse.json({ tools: toolsWithStats }, { status: 200 });
    }

    const tool = await getToolBySlug(slug);
    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }
    const stats = await getToolReviewStats(tool.id);
    return NextResponse.json({ tool: { ...tool, reviewStats: stats } }, { status: 200 });
  } catch (error) {
    console.error('API tools GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/tools - submit a new tool
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = submitToolSchema.parse(body);

    const existingTool = await db.query.tools.findFirst({
      where: (tools, { eq }) => eq(tools.slug, validatedData.slug),
    });

    if (existingTool) {
      return NextResponse.json(
        { error: 'Tool with this slug already exists' },
        { status: 409 }
      );
    }

    const [newTool] = await db.insert(tools).values({
      ...validatedData,
      status: 'pending',
      affiliateEnabled: false,
      submittedBy: validatedData.userId || null,
    }).returning();

    // Send email notification to admin (if Resend configured)
    if (process.env.RESEND_API_KEY) {
      let submitterEmail: string | null = validatedData.submitterEmail || null;
      if (!submitterEmail && validatedData.userId) {
        const userId = validatedData.userId as string;
        const user = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.id, userId) });
        submitterEmail = user?.email || null;
      }
      if (submitterEmail) {
        sendToolSubmitNotification({
          toolName: validatedData.name,
          toolSlug: validatedData.slug,
          submitterEmail,
          description: validatedData.description,
          websiteUrl: validatedData.websiteUrl,
          pricingModel: validatedData.pricingModel,
        }).catch((err) => console.error('Failed to send submit notification:', err));
      }
    }

    return NextResponse.json({ success: true, tool: newTool }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('API tools POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
