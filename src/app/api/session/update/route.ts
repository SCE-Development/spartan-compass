// Update database and session 
import { updateUserName} from "@/lib/db/user";
import { getCurrentSession } from "@/lib/db/session";

export async function PUT() {
  // get the new name sent along with the request
  const { user, session } = await getCurrentSession();
  if (user) {
    await updateUserName(user.googleId, "newName")
  }

}