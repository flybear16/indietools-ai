import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPosts, getPostBySlug } from '@/lib/db/queries';

// GET /api/posts - all published posts
// GET /api/posts?slug=xxx - single post by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      const posts = await getPublishedPosts();
      return NextResponse.json({ posts }, { status: 200 });
    }

    const post = await getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error('API posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
