"use server";

import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { coursesTable } from "@/lib/db/schema";

export default async function smartSearch(term: string) {
  const trimmedTerm = term.trim();

  if (trimmedTerm.length < 3) {
    return [];
  }
  const formattedTerm = trimmedTerm.replace(/\s+/g, " & ") + ":*";
  await db.execute(sql`select to_tsvector('english', ${term})`);
  const result = await db.select().from(coursesTable).where(sql`(
    setweight(to_tsvector('english', ${coursesTable.subject}), 'A') ||
    setweight(to_tsvector('english', ${coursesTable.courseNumber}), 'A') || 
    setweight(to_tsvector('english', ${coursesTable.title}), 'B') ||
    setweight(to_tsvector('english', ${coursesTable.description}), 'C')) ||
    setweight(to_tsvector('english', ${coursesTable.semester}), 'D')
    @@ to_tsquery('english', ${formattedTerm}
  )`);
  return result;
}
