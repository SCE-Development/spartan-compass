import {fetchAllProfessors} from "./scrapers/rmp-find-professors";

async function main() {
  const data = await fetchAllProfessors();
  const parsedProfessors = JSON.stringify(data, null, "  ")
  console.log(parsedProfessors);
}

main();
