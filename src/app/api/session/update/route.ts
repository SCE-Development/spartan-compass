// Update database and session 
import { updateUserName} from "@/lib/db/user";
import { getCurrentSession } from "@/lib/db/session";
import { NextRequest, NextResponse } from "next/server";
export async function PUT(req:NextRequest) {
  try {
    const { name } = await req.json()
    const {user} = await getCurrentSession()
    if (user && name) {
      await updateUserName(user.googleId, name)
      return NextResponse.json({ message: `Updated name to ${name}`}, {status: 200});
    }
    return NextResponse.json({ error: "Missing name or user session not found"}, {status: 400})

  } catch(error) {
    console.error("Error updating user name:", error);
    return NextResponse.json({error: "Invalid request"}, {status: 500})
  }

}