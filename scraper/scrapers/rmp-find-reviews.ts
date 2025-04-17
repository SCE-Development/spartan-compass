import { encodeBasicCredentials } from "arctic/dist/request";

const query = `\
query RatingsListQuery(
  $count: Int!
  $id: ID!
  $courseFilter: String
  $cursor: String
) {
  node(id: $id) {
    # __typename
    ... on Teacher {
      ratings(first: $count, after: $cursor, courseFilter: $courseFilter) {
        edges {
          cursor
          node {
            # __typename
            id
            date
            class
            helpfulRating
            difficultyRating
            comment

            # attendanceMandatory
            # wouldTakeAgain
            # grade
            # textbookUse
            # isForOnlineClass
            # isForCredit

            # ratingTags

            # thumbsUpTotal
            # thumbsDownTotal
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    # id
  }
}
`;

export type ProfessorRating = {
  id: string;
  date: string;
  class: string;
  helpfulRating: number;
  difficultyRating: number;
  comment: string;
};

export type ProfessorRatingsPage = {
  node: {
    ratings: {
      edges: Array<{
        cursor: string;
        node: ProfessorRating;
      }>;
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
    };
  };
};

function variables(cursor: string, count: number, professorId: string) {
  return {
    id: professorId,
    cursor,
    count,
  };
}

/**
 *
 * @param params.cursor specify first professor id of the page, set to empty string to return from the first professor
 * @param params.count specify count of entries to return on the page, max of 1000.
 * @param params.professorId specify the RMP professor id to fetch reviews for
 */
export async function rmpFindProfessorReviews(params: {
  cursor: string;
  count: number;
  professorId: string;
}) {
  const url = "https://www.ratemyprofessors.com/graphql";
  const body = JSON.stringify({
    query,
    variables: variables(params.cursor, params.count, params.professorId),
  });
  const options = {
    method: "POST",
    headers: {
      authorization: "Basic " + encodeBasicCredentials("test", "test"),
      "content-type": "application/json",
    },
    body: body,
  };

  const response = await fetch(url, options);
  const data = await response.json();
  if (data["errors"]) throw data["errors"];

  return data["data"] as ProfessorRatingsPage;
}

export async function rmpFindAllProfessorReviews(professorId: string) {
  const batchSize = 1000;
  const allReviews: ProfessorRating[] = [];
  let cursor = "";
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await rmpFindProfessorReviews({
      cursor,
      count: batchSize,
      professorId,
    });
    allReviews.push(...data.node.ratings.edges.map((edge) => edge.node));
    cursor = data.node.ratings.pageInfo.endCursor;
    hasNextPage = data.node.ratings.pageInfo.hasNextPage;
  }

  return allReviews;
}
