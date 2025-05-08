import { generateState, generateCodeVerifier } from 'arctic';
import { google } from '@/lib/oauth';
import { cookies } from 'next/headers';
import { addBasePath } from 'next/dist/client/add-base-path';

export async function GET(): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    'openid',
    'profile',
    'email',
  ]);

  cookies().set('google_oauth_state', state, {
    path: addBasePath('/'),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10, // 10 minutes
    sameSite: 'lax',
  });
  cookies().set('google_code_verifier', codeVerifier, {
    path: addBasePath('/'),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10, // 10 minutes
    sameSite: 'lax',
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
