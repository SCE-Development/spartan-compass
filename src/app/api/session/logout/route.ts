import { NextResponse } from 'next/server';
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from '@/lib/db/session';

export async function POST() {
  const { session } = await getCurrentSession();
  if (session) {
    await invalidateSession(session.id);
    deleteSessionTokenCookie();
  }
  return NextResponse.json({ success: true });
}
