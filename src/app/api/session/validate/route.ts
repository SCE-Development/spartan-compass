import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/db/session';

export async function GET() {
  const sessionData = await getCurrentSession();
  return NextResponse.json(sessionData);
}
