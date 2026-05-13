import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getActiveSubscribers, getRecentTools, getPublishedPosts } from '@/lib/db/queries';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'IndieTools <hello@indietools.ai>';

function generateNewsletterHtml({ tools, posts, weekOf }: { tools: any[]; posts: any[]; weekOf: string }) {
  const toolsHtml = tools.length > 0 ? tools.map(tool => `
    <div style="display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
      <div style="flex: 1;">
        <a href="https://indietools.ai/tools/${tool.slug}" style="font-weight: 600; color: #111; text-decoration: none;">
          ${tool.name}
        </a>
        <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">
          ${(tool.description || '').substring(0, 120)}${(tool.description || '').length > 120 ? '...' : ''}
        </p>
        <span style="display: inline-block; margin-top: 6px; font-size: 12px; background: #f3f4f6; padding: 2px 8px; border-radius: 4px;">
          ${tool.category?.name || 'General'} · ${(tool.pricingModel || 'freemium').replace('_', ' ')}
        </span>
      </div>
      <a href="https://indietools.ai/tools/${tool.slug}" style="color: #6366f1; text-decoration: none; font-size: 14px;">
        View →
      </a>
    </div>
  `).join('') : '<p style="color: #6b7280;">No new tools this week.</p>';

  const postsHtml = posts.length > 0 ? posts.map(post => `
    <div style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
      <a href="https://indietools.ai/blog/${post.slug}" style="font-weight: 600; color: #111; text-decoration: none;">
        ${post.title}
      </a>
      ${post.excerpt ? `<p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">${post.excerpt.substring(0, 100)}...</p>` : ''}
    </div>
  `).join('') : '<p style="color: #6b7280;">No new posts this week.</p>';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { color: #6366f1; margin: 0; font-size: 24px; }
    .section { margin: 24px 0; }
    .section h2 { font-size: 18px; color: #111; margin-bottom: 12px; }
    .footer { border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 16px; color: #6b7280; font-size: 14px; }
    .footer a { color: #6366f1; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛠️ IndieTools Weekly</h1>
    <p style="color: #6b7280; margin: 4px 0 0;">Week of ${weekOf}</p>
  </div>
  <div class="section">
    <h2>🆕 New Tools This Week</h2>
    ${toolsHtml}
  </div>
  <div class="section">
    <h2>📝 Latest from the Blog</h2>
    ${postsHtml}
  </div>
  <div class="section" style="background: #f9fafb; padding: 16px; border-radius: 8px;">
    <h2 style="font-size: 16px;">💡 Pro Tip</h2>
    <p style="margin: 0; font-size: 14px;">
      Upgrade to <a href="https://indietools.ai/subscription">Pro</a> to unlock advanced filters, unlimited tool comparisons, and more!
    </p>
  </div>
  <div class="footer">
    <p>You received this email because you subscribed at <a href="https://indietools.ai">IndieTools.ai</a></p>
    <p><a href="https://indietools.ai/unsubscribe">Unsubscribe</a> · <a href="https://indietools.ai">Home</a> · <a href="https://indietools.ai/tools">Browse Tools</a></p>
    <p style="margin-top: 12px;">© 2024 IndieTools.ai. Built for indie developers.</p>
  </div>
</body>
</html>
  `.trim();
}

// POST /api/newsletter/send - Send newsletter to all subscribers
export async function POST() {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const subscribers = await getActiveSubscribers();

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No subscribers found' }, { status: 404 });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTools = await getRecentTools();
    const recentPosts = await getPublishedPosts();

    const weekOf = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const html = generateNewsletterHtml({ tools: recentTools, posts: recentPosts, weekOf });
    const subject = `🛠️ IndieTools Weekly - ${recentTools.length} new tools this week`;

    // Send in batches
    const BATCH_SIZE = 10;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map((to) =>
          resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html,
          })
        )
      );
      sent += results.filter(r => r.status === 'fulfilled').length;
      failed += results.filter(r => r.status === 'rejected').length;
    }

    return NextResponse.json({ success: true, sent, failed, total: subscribers.length });
  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 });
  }
}

// GET /api/newsletter/preview - Preview newsletter HTML
export async function GET() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentTools = await getRecentTools();
  const recentPosts = await getPublishedPosts();

  const weekOf = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const html = generateNewsletterHtml({ tools: recentTools, posts: recentPosts, weekOf });

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}