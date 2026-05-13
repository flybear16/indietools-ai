import { NextRequest, NextResponse } from 'next/server';
import { sendToolReviewNotification } from '@/lib/email';
import { db } from '@/lib/db';
import { tools } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolSlug, userEmail, status, reviewNote } = body;

    // Validate required fields
    if (!toolSlug || !userEmail || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: toolSlug, userEmail, status' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "approved" or "rejected"' },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email notification');
      return NextResponse.json({ success: true, skipped: true, reason: 'RESEND_API_KEY not configured' });
    }

    // Get tool name
    const tool = await db.query.tools.findFirst({
      where: (tools, { eq }) => eq(tools.slug, toolSlug),
    });

    const toolName = tool?.name || toolSlug;

    const result = await sendToolReviewNotification({
      toolName,
      toolSlug,
      userEmail,
      status,
      reviewNote,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
