"use server";

import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { coursesTable } from "@/lib/db/schema";

export default async function smartSearch(term: string) {
  const formattedTerm = term.trim().replace(/\s+/g, " & ");
  await db.execute(sql`select to_tsvector('english', ${term})`);
  const result = await db.select().from(coursesTable).where(sql`(
    setweight(to_tsvector('english', ${coursesTable.title}), 'A') ||
    setweight(to_tsvector('english', ${coursesTable.description}), 'D')) ||
    setweight(to_tsvector('english', ${coursesTable.subject}), 'C') ||
    setweight(to_tsvector('english', ${coursesTable.courseNumber}), 'B') || 
    setweight(to_tsvector('english', ${coursesTable.semester}), 'D')
    @@ to_tsquery('english', ${formattedTerm}
  )`);
  return result;
}
