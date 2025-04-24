"use server";

import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { coursesTable, professorsTable } from "@/lib/db/schema";
import { SearchResult } from "@/components/smart-search";

export default async function smartSearch(term: string): Promise<SearchResult> {
  const trimmedTerm = term.trim();

  if (trimmedTerm.length < 3) {
    return { type: "empty", data: [] };
  }

  const formattedTerm = trimmedTerm.replace(/\s+/g, " & ") + ":*";
  await db.execute(sql`select to_tsvector('english', ${term})`);

  // Search in coursesTable
  const courseResults = await db.select().from(coursesTable).where(sql`(
    setweight(to_tsvector('english', ${coursesTable.subject}), 'A') ||
    setweight(to_tsvector('english', ${coursesTable.courseNumber}), 'A') || 
    setweight(to_tsvector('english', ${coursesTable.title}), 'B') ||
    setweight(to_tsvector('english', ${coursesTable.description}), 'C') ||
    setweight(to_tsvector('english', ${coursesTable.semester}), 'D')
  ) @@ to_tsquery('english', ${formattedTerm})`);

  // Search in professorsTable
  const professorResults = await db.select().from(professorsTable).where(sql`(
    setweight(to_tsvector('english', ${professorsTable.name}), 'A') ||
    setweight(to_tsvector('english', ${professorsTable.department}), 'B')
  ) @@ to_tsquery('english', ${formattedTerm})`);

  if (courseResults.length === 0 && professorResults.length === 0) {
    return { type: "none", data: [] };
  }

  // Combine results into a unified structure
  return {
    type: "combined",
    data: {
      courses: courseResults,
      professors: professorResults,
    },
  };
}
