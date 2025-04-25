"use server";

import { sql, desc, getTableColumns } from "drizzle-orm";
import { db } from "@/lib/db";
import { coursesTable, professorsTable } from "@/lib/db/schema";
import { SearchResult } from "@/components/smart-search";

export default async function smartSearch(term: string): Promise<SearchResult> {
  const trimmedTerm = term.trim();

  if (trimmedTerm.length < 3) {
    return { type: "empty", data: [] };
  }

  const formattedTerm = trimmedTerm.replace(/\s+/g, " & ") + ":*";

  const courseMatchQuery = sql`(
    setweight(to_tsvector('english', ${coursesTable.subject}), 'A') ||
    setweight(to_tsvector('english', ${coursesTable.courseNumber}), 'A') || 
    setweight(to_tsvector('english', ${coursesTable.title}), 'B') ||
    setweight(to_tsvector('english', ${coursesTable.description}), 'C') ||
    setweight(to_tsvector('english', ${coursesTable.semester}), 'D')
  )`;
  const courseResults = await db
    .select({
      ...getTableColumns(coursesTable),
      rank: sql`ts_rank(${courseMatchQuery}, to_tsquery('english', ${formattedTerm}))`,
      rankCd: sql`ts_rank_cd(${courseMatchQuery}, to_tsquery('english', ${formattedTerm}))`,
    })
    .from(coursesTable)
    .where(sql`${courseMatchQuery} @@ to_tsquery('english', ${formattedTerm})`)
    .orderBy((t) => desc(t.rank));

  const professorMatchQuery = sql`(
    setweight(to_tsvector('english', ${professorsTable.name}), 'A') ||
    setweight(to_tsvector('english', ${professorsTable.department}), 'B')
  )`;
  const professorResults = await db
    .select({
      ...getTableColumns(professorsTable),
      rank: sql`ts_rank(${professorMatchQuery}, to_tsquery('english', ${formattedTerm}))`,
      rankCd: sql`ts_rank_cd(${professorMatchQuery}, to_tsquery('english', ${formattedTerm}))`,
    })
    .from(professorsTable)
    .where(
      sql`${professorMatchQuery} @@ to_tsquery('english', ${formattedTerm})`,
    )
    .orderBy((t) => desc(t.rank));

  if (courseResults.length === 0 && professorResults.length === 0) {
    return { type: "none", data: [] };
  }

  return {
    type: "combined",
    data: {
      courses: courseResults,
      professors: professorResults,
    },
  };
}
