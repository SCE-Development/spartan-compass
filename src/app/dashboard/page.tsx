import { redirect } from "next/navigation";
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "@/lib/db/session";

export default async function Page() {
  const { user } = await getCurrentSession();

  if (user === null) {
   
    return redirect("/login");
  }

 
  return (
    <div>
      <h1>{user.name}</h1>
      <h1> {user.googleId}</h1>
      <h1> {user.id}</h1>
    </div>
  );
}

async function logout(): Promise<ActionResult> {
  "use server"; 

  
  const { session } = await getCurrentSession();

  
  if (!session) {
    return { error: "Unauthorized" };
  }

  
  await invalidateSession(session.id);
  deleteSessionTokenCookie();

  return redirect("/login");
}

interface ActionResult {
  error: string | null;
}
