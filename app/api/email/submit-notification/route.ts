import { NextRequest, NextResponse } from 'next/server';
import { sendToolSubmitNotification } from '@/lib/email';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolName, toolSlug, submitterEmail, description, websiteUrl, pricingModel } = body;

    // Validate required fields
    if (!toolName || !toolSlug || !submitterEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: toolName, toolSlug, submitterEmail' },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email notification');
      return NextResponse.json({ success: true, skipped: true, reason: 'RESEND_API_KEY not configured' });
    }

    const result = await sendToolSubmitNotification({
      toolName,
      toolSlug,
      submitterEmail,
      description: description || '',
      websiteUrl: websiteUrl || '',
      pricingModel: pricingModel || 'freemium',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
