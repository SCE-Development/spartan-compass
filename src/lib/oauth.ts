import { Google } from "arctic";
import { addBasePath } from "next/dist/client/add-base-path";

export const google = new Google(
	process.env.GOOGLE_CLIENT_ID ?? "default_client_id",
	process.env.GOOGLE_CLIENT_SECRET ?? "default_client_secret",
	(process.env.ORIGIN ?? "http://localhost:3000") + addBasePath("/login/google/callback"),
);
