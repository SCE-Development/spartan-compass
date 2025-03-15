import {fetchAllProfessors} from "./scrapers/rmp-find-professors";
import { fetchAllCourses } from "./scrapers/sjsu-find-courses";

async function main() {
  const profData = await fetchAllProfessors();
  const parsedProfessors = JSON.stringify(profData, null, "  ")
  console.log(parsedProfessors);
  const classData = await fetchAllCourses();
  const parsedCourses = JSON.stringify(classData, null, "  ")
  console.log(parsedCourses)
  console.log(`Total professors scraped: ${profData.length}`);
  console.log(`Total courses scraped: ${classData.length}`);
}

main();
