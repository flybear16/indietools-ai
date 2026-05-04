'use server';

import { subscribeEmail, getSubscriptionByEmail } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source = 'homepage' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await getSubscriptionByEmail(email);
    if (existing) {
      if (!existing.isActive) {
        // Reactivate subscription
        await subscribeEmail(email, source);
        return NextResponse.json({ success: true, message: 'Welcome back! You have been resubscribed.' });
      }
      return NextResponse.json(
        { error: 'Already subscribed' },
        { status: 409 }
      );
    }

    await subscribeEmail(email, source);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed! Check your inbox for confirmation.' 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}