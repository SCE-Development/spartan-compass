import { Google } from "arctic";
import jwt from "jsonwebtoken";

export const google = new Google(
	process.env.GOOGLE_CLIENT_ID ?? "default_client_id",
	process.env.GOOGLE_CLIENT_SECRET ?? "default_client_secret",
	"http://localhost:3000/login/google/callback"
);


export function decodeIdToken(token: string) {
	const decoded = jwt.decode(token) as { [key: string]: any };
	if (!decoded) {
	  throw new Error("Invalid ID token");
	}
	return decoded;
  }