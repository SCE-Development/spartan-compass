import { getCurrentSession } from "@/lib/db/session";
import { redirect } from "next/navigation";

async function Page() {
	const { user } = await getCurrentSession();
	if (user === null) {
		return redirect("/login");
	}

	async function action() {
		"use server";
		const { user } = await getCurrentSession();
		if (user === null) {
			return redirect("/login");
		}
		
	}
	
}