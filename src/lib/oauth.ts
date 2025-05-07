import { Google } from "arctic";

export const google = new Google(
	process.env.GOOGLE_CLIENT_ID ?? "default_client_id",
	process.env.GOOGLE_CLIENT_SECRET ?? "default_client_secret",
	"http://localhost:3000/login/google/callback"
);

