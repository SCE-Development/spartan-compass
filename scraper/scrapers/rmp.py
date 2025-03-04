import requests

RMP_URL = "https://www.ratemyprofessors.com/graphql"
AUTH_USERNAME = "test"
AUTH_PASSWORD = "test"

def get_professors():
  query = """
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
  """

  variables = {
    "query": {
        "text": "",
        "schoolID": "U2Nob29sLTg4MQ==",
        "fallback": True,
        "departmentID": None
    },
    #1000 is max for one page
    "count": 1000
  }

  professors = []
  has_next_page = True
  cursor = None


  while has_next_page:
    variables["cursor"] = cursor
    
    response = requests.post(
        RMP_URL,
        json={"query": query, "variables": variables},
        auth=(AUTH_USERNAME, AUTH_PASSWORD)
    )

    if response.status_code == 200:
        data = response.json()
        teachers = data["data"]["search"]["teachers"]
        edges = teachers["edges"]
        page_info = teachers["pageInfo"]
        for teacher in edges:
            node = teacher["node"]
            professor_data = {
                "avgDifficulty": node["avgDifficulty"],
                "avgRating": node["avgRating"],
                "department": node["department"],
                "firstName": node["firstName"],
                "lastName": node["lastName"],
                "numRatings": node["numRatings"],
                # -1 means N/A percentage
                "wouldTakeAgainPercent": node["wouldTakeAgainPercent"]
            }
            professors.append(professor_data)
        has_next_page = page_info.get("hasNextPage", False)
        cursor = page_info.get("endCursor")
    else:
        return f"Error: Unable to fetch data. Status code: {response.status_code}"
  return professors

