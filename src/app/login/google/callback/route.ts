import { generateSessionToken, createSession, setSessionTokenCookie } from "@/lib/db/session";
import { google } from "@/lib/oauth";
import { cookies } from "next/headers";
import { decodeIdToken } from "arctic";
import type { OAuth2Tokens } from "arctic";
import { createUser, getUserFromGoogleId } from "@/lib/db/user";

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies().get("google_oauth_state")?.value ?? null;
	const codeVerifier = cookies().get("google_code_verifier")?.value ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		console.error("Error validating authorization code:", e);
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	interface Claims {
		sub: string;
		email: string;
		name: string;
	}
	const claims = decodeIdToken(tokens.idToken()) as Claims;

	const googleUserId = claims.sub;
	const username = claims.name;
	
	// Check if the email is SJSU email
	const email = claims.email;
	if (!email || !email.trim().endsWith("@sjsu.edu")) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/login?error=invalid_email'
			}
		});
	}

	// TODO: Replace this with your own DB query.
	const existingUser = await getUserFromGoogleId(googleUserId);

	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	// TODO: Replace this with your own DB query.
	const user = await createUser(googleUserId, username);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}