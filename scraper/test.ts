import { rmpFindProfessorsPage } from "./scrapers/rmp-find-professors";
import { fetchAllCourses } from "./scrapers/sjsu-find-courses";
import { rmpFindProfessorReviews } from "./scrapers/rmp-find-reviews";

const sampleCount = 2;

async function main() {
  const profData = await rmpFindProfessorsPage({cursor: "", count: sampleCount});
  console.log("RMP scraped professors", profData.edges);
  console.log("RMP scraped professors page info", profData.pageInfo);

  const classData = await fetchAllCourses();
  console.log("SJSU scraped courses", classData.slice(0, sampleCount));

  const professor = profData.edges[0].node;
  const reviews = await rmpFindProfessorReviews({cursor: "", count: sampleCount, professorId: professor.id});
  console.log(`RMP scraped professor reviews for ${professor.firstName} ${professor.lastName}`, reviews);

  console.log("Total professors scraped:", profData.edges.length);
  console.log("Total courses scraped:", classData.length);
  console.log(`Total reviews scraped (for ${professor.firstName} ${professor.lastName}):`, reviews.node.ratings.edges.length);
}

main();
