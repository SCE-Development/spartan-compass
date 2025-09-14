import { encodeBasicCredentials } from 'arctic/dist/request';
import { z } from 'zod';

const query = `\
query TeacherSearchResultsPageQuery($query: TeacherSearchQuery!, $cursor: String, $count: Int!) {
  search: newSearch {
    teachers(query: $query, first: $count, after: $cursor) {
      edges {
        node {
          id
          avgRating
          numRatings
          firstName
          lastName
          department
          wouldTakeAgainPercent
          avgDifficulty
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
`;

export type ProfessorDetails = {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  avgRating: number;
  avgDifficulty: number;
  numRatings: number;
  wouldTakeAgainPercent: number;
};

export type ProfessorsPage = {
  edges: Array<{
    node: ProfessorDetails;
  }>;
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  };
};

function variables(cursor: string, count: number) {
  return {
    query: {
      schoolID: 'U2Nob29sLTg4MQ==',
      // "fallback": true,
    },
    cursor: cursor,
    count: count,
  };
}

/**
 *
 * @param params.cursor specify first professor id of the page, set to empty string to return from the first professor
 * @param params.count specify count of entries to return on the page, max of 1000.
 */
export async function rmpFindProfessorsPage(params: {
  cursor: string;
  count: number;
}) {
  const url = 'https://www.ratemyprofessors.com/graphql';
  const body = JSON.stringify({
    query,
    variables: variables(params.cursor, params.count),
  });
  const options = {
    method: 'POST',
    headers: {
      authorization: `Basic ${encodeBasicCredentials('test', 'test')}`,
      'content-type': 'application/json',
    },
    body: body,
  };

  const response = await fetch(url, options);
  const data = await response.json();
  if (data.errors) throw data.errors;

  // Zod schema for runtime validation
  const ProfessorDetailsSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    department: z.string(),
    avgRating: z.number(),
    avgDifficulty: z.number(),
    numRatings: z.number(),
    wouldTakeAgainPercent: z.number(),
  });

  const ProfessorsPageSchema = z.object({
    edges: z.array(z.object({ node: ProfessorDetailsSchema })),
    pageInfo: z.object({
      endCursor: z.string(),
      hasNextPage: z.boolean(),
    }),
  });

  return ProfessorsPageSchema.parse(data.data.search.teachers);
}

export async function rmpFindAllProfessors() {
  const batchSize = 1000;
  const allProfessors: ProfessorDetails[] = [];
  let cursor = '';
  let hasNextPage = true;

  while (hasNextPage) {
    const professors = await rmpFindProfessorsPage({
      cursor,
      count: batchSize,
    });
    allProfessors.push(...professors.edges.map((edge) => edge.node));
    cursor = professors.pageInfo.endCursor;
    hasNextPage = professors.pageInfo.hasNextPage;
  }
  return allProfessors;
}
