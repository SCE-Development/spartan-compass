'use server';

import { sql, desc, getTableColumns } from 'drizzle-orm';
import { db } from '@/lib/db';
import { coursesTable, professorsTable } from '@/lib/db/schema';
import { SearchResult } from '@/components/smart-search';

export default async function smartSearch(term: string): Promise<SearchResult> {
  const trimmedTerm = term.trim();

  if (trimmedTerm.length < 3) {
    return { type: 'empty', data: [] };
  }

  const formattedTerm = trimmedTerm.replace(/\s+/g, ' & ') + ':*';

  const courseResults = await db
    .select({
      ...getTableColumns(coursesTable),
      rank: sql`ts_rank(${coursesTable.searchVector}, ${formattedTerm})`,
      rankCd: sql`ts_rank_cd(${coursesTable.searchVector}, ${formattedTerm})`,
    })
    .from(coursesTable)
    .where(sql`${coursesTable.searchVector} @@ ${formattedTerm}`)
    .orderBy((t) => desc(t.rank));

  const professorResults = await db
    .select({
      ...getTableColumns(professorsTable),
      rank: sql`ts_rank(${professorsTable.searchVector}, ${formattedTerm})`,
      rankCd: sql`ts_rank_cd(${professorsTable.searchVector}, ${formattedTerm})`,
    })
    .from(professorsTable)
    .where(sql`${professorsTable.searchVector} @@ ${formattedTerm}`)

    .orderBy((t) => desc(t.rank));

  if (courseResults.length === 0 && professorResults.length === 0) {
    return { type: 'none', data: [] };
  }

  return {
    type: 'combined',
    data: {
      courses: courseResults,
      professors: professorResults,
    },
  };
}
