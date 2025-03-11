import {encodeBasicCredentials} from "arctic/dist/request";

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

function variables(cursor: string, count: number) {
  return {
    query: {
      schoolID: "U2Nob29sLTg4MQ==",
      // "fallback": true,
    },
    cursor: cursor,
    count: count,
  }
}

/**
 *
 * @param params.cursor specify first professor id of the page, set to empty string to return from the first professor
 * @param params.count specify count of entries to return on the page, max of 1000.
 */
export async function rmpFindProfessors(params: { cursor: string, count: number }) {
  const url = "https://www.ratemyprofessors.com/graphql";
  const body = JSON.stringify({
    query,
    variables: variables(params.cursor, params.count),
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

  return data["data"]["search"]["teachers"];
}
