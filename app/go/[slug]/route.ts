import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { tools, clicks } from '@/lib/db/schema';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: Props) {
  const { slug } = await params;
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const referer = headersList.get('referer') || '';

  const tool = await db.query.tools.findFirst({
    where: (tools, { eq }) => eq(tools.slug, slug),
  });

  if (!tool || !tool.affiliateEnabled || !tool.affiliateUrl) {
    return NextResponse.redirect(new URL('/tools', request.url));
  }

  // Log the click asynchronously
  db.insert(clicks).values({
    toolId: tool.id,
    referrer: referer,
    userAgent,
  }).catch(console.error);

  // Redirect to affiliate URL
  return NextResponse.redirect(tool.affiliateUrl as string);
}
