import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { addFavorite, removeFavorite, getUserFavorites } from '@/lib/db/queries';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const favorites = await getUserFavorites(session.user.id);
  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { toolId } = await req.json();
  if (!toolId) {
    return NextResponse.json({ error: 'toolId required' }, { status: 400 });
  }

  const result = await addFavorite(session.user.id, toolId);
  return NextResponse.json(result || { success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const toolId = searchParams.get('toolId');
  if (!toolId) {
    return NextResponse.json({ error: 'toolId required' }, { status: 400 });
  }

  await removeFavorite(session.user.id, toolId);
  return NextResponse.json({ success: true });
}